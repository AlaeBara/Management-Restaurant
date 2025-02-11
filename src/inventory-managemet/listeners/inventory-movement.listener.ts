import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent } from "typeorm";
import { forwardRef, Inject } from "@nestjs/common";

import { Inventory } from "../entities/inventory.entity";
import { OutboxService } from "src/outbox-module/services/outbox.service";
import { OutboxAction } from "src/outbox-module/enums/outbox-action.enum";
import { InventoryMovement } from "../entities/inventory-movement.entity";

@EventSubscriber()
export class InventoryMovementListener implements EntitySubscriberInterface<InventoryMovement> {

  constructor(
    @Inject(forwardRef(() => OutboxService))
    private readonly outboxService: OutboxService
  ) { }

  listenTo() {
    return InventoryMovement;
  }

  async afterInsert(event: InsertEvent<InventoryMovement>) {
    console.log(`New Inventory Movement record created with ID: ${event.entity.id}`);
    const outbox = await this.outboxService.initOutbox(OutboxAction.NEW_INVENTORY_MOVEMENT, event.entity);
    console.log("outbox.payload.id", outbox.payload.id)
  }

}