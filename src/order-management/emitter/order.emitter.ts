import { Inject } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { OutboxService } from "src/outbox-module/services/outbox.service";
import { Order } from "../entities/order.entity";
import { forwardRef } from "@nestjs/common";
import { OrderEventService } from "../services/event/order.event.service";
import { DataSource } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { OutboxAction } from "src/outbox-module/enums/outbox-action.enum";
import { OutboxStatus } from "src/outbox-module/enums/outbox-status.enum";

export class OrderEmitterEvent {

    constructor(
        @InjectDataSource() public dataSource: DataSource,
        @Inject(forwardRef(() => OutboxService))
        private readonly outboxService: OutboxService,
        @Inject(forwardRef(() => OrderEventService))
        private readonly orderEventService: OrderEventService,
    ) { }

    async inizializeQueryRunner() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        return queryRunner;
    }

    @OnEvent('order.created')
    async emitOrderCreated(orderId: string) {
        const queryRunner = await this.inizializeQueryRunner();
        try {
            await this.orderEventService.deductMenuItemQuantityNoRecipe(orderId, queryRunner);

            await this.outboxService.initOutbox(
                OutboxAction.ORDER_CREATED,
                { orderId },
                OutboxStatus.PROCESSED,
                null,
                queryRunner
            );

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();

            await this.outboxService.initOutbox(
                OutboxAction.ORDER_CREATED,
                { orderId },
                OutboxStatus.FAILED,
                error.message
            );

        } finally {
            await queryRunner.release();
        }
    }
}


