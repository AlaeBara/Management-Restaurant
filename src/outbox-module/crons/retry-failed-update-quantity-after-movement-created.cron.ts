import { InventoryMovement } from "src/inventory-managemet/entities/inventory-movement.entity";
import { OutboxStatus } from "../enums/outbox-status.enum";
import { OutboxAction } from "../enums/outbox-action.enum";
import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { SchedulerRegistry } from "@nestjs/schedule";
import { OutboxService } from "../services/outbox.service";
import { MenuItemRecipeService } from "src/menu-item-management/services/menu-item-recipe.service";
import { MenuItemService } from "src/menu-item-management/services/menu-item.service";

@Injectable()
export class RetryFailedUpdateQuantityAfterMovementCreatedCron {
  private readonly logger = new Logger(RetryFailedUpdateQuantityAfterMovementCreatedCron.name);
  private isEnabled = true;

  constructor(
    private readonly outboxService: OutboxService,
    private readonly menuItemRecipeService: MenuItemRecipeService,
    private readonly menuItemService: MenuItemService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) { }

  @Cron(CronExpression.EVERY_10_SECONDS, {
    name: 'retryFailedUpdateQuantityAfterMovementCreated',
  })
  async handleRetryFailedMenuItems() {
    if (!this.isEnabled) {
      this.logger.debug('Retry failed update quantity after movement created cron job is disabled');
      return;
    }

    try {
      const failedActions = await this.outboxService.outboxRepository.find({
        where: {
          action: OutboxAction.INVENTORY_MOVEMENT_CREATED,
          status: OutboxStatus.FAILED,
        }
      });

      if (failedActions.length === 0) {
        this.logger.debug('No failed update quantity after movement created actions to retry');
        this.stopPolling();
        return;
      }

      this.logger.log(`Found ${failedActions.length} failed inventory movement actions to retry`);

      for (const outbox of failedActions) {
        try {
          this.logger.debug(`Processing retry for inventory movement created action ID: ${outbox.id}`);
          
          const inventoryMovement = outbox.payload as InventoryMovement;
          const menuItemIds = await this.menuItemService.getMenuItemIdsByInventoryId(
            inventoryMovement.inventory.id
          );

          this.logger.debug(`Found ${menuItemIds.length} menu items to recalculate for inventory ${inventoryMovement.inventory.id}`);

          for (const menuItemId of menuItemIds) {
            const menuItem = await this.menuItemService.findOneByIdWithOptions(menuItemId);
            await this.menuItemRecipeService.recalculateQuantityBasedOnStock(menuItem);
            this.logger.debug(`Recalculated stock for menu item: ${menuItemId}`);
          }

          // Update outbox status to completed
          await this.outboxService.setOutboxStatus(outbox.id, OutboxStatus.PROCESSED);
          await this.outboxService.setAllMovementOutboxStatus(inventoryMovement.inventory.id);

          this.logger.log(`Successfully processed update quantity after movement created for ID: ${outbox.id}`);

        } catch (error) {
          this.logger.error(
            `Failed to process inventory movement for ID: ${outbox.id}. Error: ${error.message}`,
            error.stack,
          );
          await this.outboxService.setOutboxStatus(outbox.id, OutboxStatus.FAILED, error.message);
        }
      }

      this.logger.log('Completed processing retry queue for failed inventory movements');
    } catch (error) {
      this.logger.error(`Failed to process retry queue. Error: ${error.message}`, error.stack);
    }
  }

  public startPolling(): void {
    try {
      const job = this.schedulerRegistry.getCronJob('retryFailedUpdateQuantityAfterMovementCreated');
      if (!job) {
        throw new Error('Cron job not found');
      }

      if (job.running) {
        this.logger.debug('Cron job is already running');
        return;
      }

      job.start();
      this.isEnabled = true;
      this.logger.log('Retry update quantity after movement created cron job started');
    } catch (error) {
      this.logger.error(`Failed to start retry update quantity after movement created cron job: ${error.message}`);
      throw error;
    }
  }

  public stopPolling(): void {
    try {
      const job = this.schedulerRegistry.getCronJob('retryFailedUpdateQuantityAfterMovementCreated');
      if (!job) {
        throw new Error('Cron job not found');
      }

      if (!job.running) {
        this.logger.debug('Cron job is already stopped');
        return;
      }

      job.stop();
      this.isEnabled = false;
      this.logger.log('Retry update quantity after movement created cron job stopped');
    } catch (error) {
      this.logger.error(`Failed to stop retry update quantity after movement created cron job: ${error.message}`);
      throw error;
    }
  }
}
