// src/outbox/outbox.entity.ts
import { UlidBaseEntity } from 'src/common/entities/ulid-base.entity';
import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { OutboxStatus } from '../enums/outbox-status.enum';
import { OutboxAction } from '../enums/outbox-action.enum';

@Entity('outbox')
export class Outbox extends UlidBaseEntity {
  
  @Column({ type: 'enum', enum: OutboxAction })
  action: OutboxAction;

  @Column({ type: 'json' })
  payload: any;

  @Column({ type: 'enum', enum: OutboxStatus, default: OutboxStatus.PENDING })
  status: OutboxStatus;

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastFailedAt: Date;

  @Column({ type: 'text', nullable: true })
  lastFailedReason: string;

  @Column({ type: 'int', default: 0 })
  retryCount: number;

  @BeforeInsert()

  checkStatus() {
    if(this.status === OutboxStatus.FAILED) {
      this.retryCount = this.retryCount || 0;
      this.retryCount++;
      this.lastFailedAt = new Date();
    }

    if(this.status === OutboxStatus.PROCESSED) {
      this.processedAt = new Date();
    }

    if(this.status === OutboxStatus.CANCELLED) {
      this.cancelledAt = new Date();
    }
  }

  @BeforeUpdate()
  updateStatus() {
    if(this.status === OutboxStatus.FAILED) {
      this.retryCount = this.retryCount || 0;
      this.retryCount++;
      this.lastFailedAt = new Date();
    }
    if(this.status === OutboxStatus.PROCESSED) {
      this.processedAt = new Date();
    }
    if(this.status === OutboxStatus.CANCELLED) {
      this.cancelledAt = new Date();
    }
  }
}