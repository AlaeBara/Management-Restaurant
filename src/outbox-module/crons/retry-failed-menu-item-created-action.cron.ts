import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { OutboxService } from '../services/outbox.service';
import { MenuItemRecipeService } from 'src/menu-item-management/services/menu-item-recipe.service';
import { OutboxAction } from '../enums/outbox-action.enum';
import { OutboxStatus } from '../enums/outbox-status.enum';
import { MenuItem } from 'src/menu-item-management/entities/menu-item.entity';


@Injectable()
export class RetryFailedMenuItemCreatedActionCron {
  private readonly logger = new Logger(RetryFailedMenuItemCreatedActionCron.name);
  private isEnabled = true;

  constructor(
    private readonly outboxService: OutboxService,
    private readonly menuItemRecipeService: MenuItemRecipeService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) { }

  @Cron(CronExpression.EVERY_10_SECONDS, {
    name: 'retryFailedMenuItemCreatedAction',
  })
  async handleRetryFailedMenuItems() {
    if (!this.isEnabled) {
      console.log('Retry failed menu item cron job is disabled');
      return;
    }

    try {
      const failedActions = await this.outboxService.outboxRepository.find({where: {
        action: OutboxAction.MENU_ITEM_CREATED, //should track only hasrecuipe
        status: OutboxStatus.FAILED,
      }});

      if (failedActions.length === 0) {
        this.logger.log('No failed menu item creation actions to retry');
        this.stopPolling();
        return;
      }

      this.logger.log(`Found ${failedActions.length} failed menu item creation actions to retry`);

      for (const outbox of failedActions) {
        try {
          this.logger.debug(`Attempting to retry menu item creation for ID: ${outbox.id}`);
          
          // Retry the recalculation
          await this.menuItemRecipeService.recalculateQuantityBasedOnStock(outbox.payload as MenuItem);

          // Update outbox status to completed
          await this.outboxService.setOutboxStatus(outbox.id, OutboxStatus.PROCESSED);
            
          this.logger.log(
            `Successfully retried menu item creation for ID: ${outbox.id}`,
          );

        } catch (error) {
          this.logger.error(
            `Failed to retry menu item creation for ID: ${outbox.id}. Error: ${error.message}`,
            error.stack,
          );
          // Update retry count and possibly mark as permanently failed
          await this.outboxService.setOutboxStatus(outbox.id, OutboxStatus.FAILED, error.message);
        }
      }

      this.logger.log(`Completed processing retry queue for failed menu items`);
    } catch (error) {
      this.logger.error(`Failed to process retry queue. Error: ${error.message}`, error.stack);
    }
  }

  public async startPolling() {
    const job = this.schedulerRegistry.getCronJob('retryFailedMenuItemCreatedAction');
    job.start();
    this.isEnabled = true;
    this.logger.log('retryFailedMenuItemCreatedAction cron job started');
  }

  public async stopPolling() {
    const job = this.schedulerRegistry.getCronJob('retryFailedMenuItemCreatedAction');
    job.stop();
    this.isEnabled = false;
    this.logger.log('retryFailedMenuItemCreatedAction cron job stopped');
  }

  /* startCron() {
    this.isEnabled = true;
    this.logger.log('Retry failed menu item cron job started');
  } */
}