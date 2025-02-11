import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";

import { GenericService } from "src/common/services/generic.service";
import { Outbox } from "../entities/outbox.entity";
import { OutboxAction } from "../enums/outbox-action.enum";
import { OutboxStatus } from "../enums/outbox-status.enum";

@Injectable()
export class OutboxService extends GenericService<Outbox> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(Outbox)
        readonly outboxRepository: Repository<Outbox>,
    ) {
        super(dataSource, Outbox, 'outbox');
    }

    async initOutbox(action: OutboxAction, payload: any, status: OutboxStatus = OutboxStatus.PENDING, lastFailedReason?: string): Promise<Outbox> {
        const outbox = await this.outboxRepository.create({
            action,
            payload,
            status,
            lastFailedReason
        });
        return this.outboxRepository.save(outbox);
    }

    async countPendingOutbox(): Promise<number> {
        return this.outboxRepository.count({
            where: {
                status: OutboxStatus.PENDING
            }
        });
    }

    async setOutboxStatus(outboxId: string, status: OutboxStatus, lastFailedReason?: string): Promise<void> {
        await this.outboxRepository.update(outboxId, { status, lastFailedReason });
    }

}