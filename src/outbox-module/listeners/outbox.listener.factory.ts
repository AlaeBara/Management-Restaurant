import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OutboxListener } from './outbox.listener';

@Injectable()
export class OutboxListenerFactory {
  constructor(
    private readonly dataSource: DataSource,
  ) { }

  create(): OutboxListener {
    const listener = new OutboxListener();
    this.dataSource.subscribers.push(listener);
    return listener;
  }
}