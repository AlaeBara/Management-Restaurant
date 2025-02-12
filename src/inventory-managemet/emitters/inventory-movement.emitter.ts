import { forwardRef, Inject } from "@nestjs/common";
import { OutboxService } from "src/outbox-module/services/outbox.service";
import { Inventory } from "../entities/inventory.entity";
import { OnEvent } from "@nestjs/event-emitter";
import { OutboxAction } from "src/outbox-module/enums/outbox-action.enum";
import { InventoryMovement } from "../entities/inventory-movement.entity";
import { MenuItemRecipeService } from "src/menu-item-management/services/menu-item-recipe.service";
import { MenuItemService } from "src/menu-item-management/services/menu-item.service";
import logger from "src/common/Loggers/logger";
import { OutboxStatus } from "src/outbox-module/enums/outbox-status.enum";
import { RetryFailedUpdateQuantityAfterMovementCreatedCron } from "src/outbox-module/crons/retry-failed-update-quantity-after-movement-created.cron";

export class InventoryMovementEmitter {

    constructor(
        @Inject(forwardRef(() => OutboxService))
        private readonly outboxService: OutboxService,
        @Inject(forwardRef(() => MenuItemRecipeService))
        private readonly menuItemRecipeService: MenuItemRecipeService,
        @Inject(forwardRef(() => MenuItemService))
        private readonly menuItemService: MenuItemService,
        @Inject(forwardRef(() => RetryFailedUpdateQuantityAfterMovementCreatedCron))
        private readonly retryFailedUpdateQuantityAfterMovementCreatedCron: RetryFailedUpdateQuantityAfterMovementCreatedCron,
        
    ) { }

    @OnEvent('inventory.movement.created')
    async inventoryMovementCreated(inventoryMovement: InventoryMovement) {
        try {
            const menuItemIds = await this.menuItemService.getMenuItemIdsByInventoryId(inventoryMovement.inventory.id);
            console.log('Menu Item IDs retrieved:', menuItemIds);

            for (const menuItemId of menuItemIds) {
                const menuItem = await this.menuItemService.findOneByIdWithOptions(menuItemId);
                console.log('Recalculating stock for Menu Item:', menuItem.id);
                await this.menuItemRecipeService.recalculateQuantityBasedOnStock(menuItem);
            }

            console.log('Outbox initialized for Inventory Movement:', inventoryMovement.inventory.id);
            await this.outboxService.initOutbox(OutboxAction.INVENTORY_MOVEMENT_CREATED, inventoryMovement, OutboxStatus.PROCESSED);
            await this.outboxService.setAllMovementOutboxStatus(inventoryMovement.inventory.id);
        } catch (error) {
            logger.error('Error in inventory movement created:', { error });
            await this.outboxService.initOutbox(OutboxAction.INVENTORY_MOVEMENT_CREATED, inventoryMovement, OutboxStatus.FAILED, error.message);
            await this.retryFailedUpdateQuantityAfterMovementCreatedCron.startPolling();
        }
    }
}
