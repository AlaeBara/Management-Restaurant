import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OutboxService } from 'src/outbox-module/services/outbox.service';
import { InventoryMovementListener } from './inventory-movement.listener';

@Injectable()
export class InventoryListenerFactory {
  constructor(
    private readonly dataSource: DataSource,
    private readonly outboxService: OutboxService,
  ) {}

  create(): InventoryMovementListener {
    const listener = new InventoryMovementListener(this.outboxService);
    this.dataSource.subscribers.push(listener); // Manually register the subscriber
    return listener;
  }
}