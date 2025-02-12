import { OutboxService } from "src/outbox-module/services/outbox.service";
import { OutboxAction } from "src/outbox-module/enums/outbox-action.enum";
import { OnEvent } from "@nestjs/event-emitter";
import { MenuItem } from "../entities/menu-item.entity";
import { forwardRef, Inject } from "@nestjs/common";
import { MenuItemRecipeService } from "../services/menu-item-recipe.service";
import { OutboxStatus } from "src/outbox-module/enums/outbox-status.enum";
import { RetryFailedMenuItemCreatedActionCron } from "src/outbox-module/crons/retry-failed-menu-item-created-action.cron";

export class MenuItemEmitter {

    constructor(
        @Inject(forwardRef(() => OutboxService))
        private readonly outboxService: OutboxService,
        @Inject(forwardRef(() => MenuItemRecipeService))
        private readonly menuItemRecipeService: MenuItemRecipeService,
        @Inject(forwardRef(() => RetryFailedMenuItemCreatedActionCron))
        private readonly retryFailedMenuItemCreatedActionCron: RetryFailedMenuItemCreatedActionCron,
    ) { }

    
    /* @OnEvent('menu-item.updated')
    async menuItemUpdated(menuItem: MenuItem) {
        if(!menuItem.hasRecipe) return;
        console.log('Event received: menu-item.updated', menuItem);
        const outbox = await this.outboxService.initOutbox(OutboxAction.MENU_ITEM_UPDATED, menuItem);
        console.log(`Menu item updated with event emitter: ${menuItem.id}`);
    } */


    @OnEvent('menu.item.created')
    async recalculateQuantityEvent(menuItem: MenuItem) {
        try {
            const recalculatedItem = await this.menuItemRecipeService.recalculateQuantityBasedOnStock(menuItem);
            
            // Only mark as processed if recalculation was successful
            if (recalculatedItem) {
                await this.outboxService.initOutbox(
                    OutboxAction.MENU_ITEM_CREATED, 
                    menuItem, 
                    OutboxStatus.PROCESSED
                );
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error during recalculation';
            await this.outboxService.initOutbox(
                OutboxAction.MENU_ITEM_CREATED, 
                menuItem, 
                OutboxStatus.FAILED, 
                errorMessage
            );
            this.retryFailedMenuItemCreatedActionCron.startPolling();
        }
    }



}

