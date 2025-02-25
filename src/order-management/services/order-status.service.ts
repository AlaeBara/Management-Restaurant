import { BadRequestException, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Order } from "../entities/order.entity";
import { GenericService } from "src/common/services/generic.service";
import { OrderActionService } from "./order-action.service";
import { OrderService } from "./order.service";
import { OrderStatus } from "../enums/order-status.enum";
import logger from "src/common/Loggers/logger";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class OrderStatusService extends GenericService<Order> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @Inject(OrderActionService)
        private orderActionService: OrderActionService,
        @Inject(OrderService)
        private orderService: OrderService,
        private eventEmitter: EventEmitter2,
    ) {
        super(dataSource, Order, 'Status de commande');
    }
    async inizializeQueryRunner() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        return queryRunner;
    }

    async validateOrder(orderId: string, req: Request) {
        const queryRunner = await this.inizializeQueryRunner();

        try {
            const order = await this.orderRepository.findOne({
                where: [{ id: orderId }],
                select: ['id', 'orderStatus'],
            });

            const validateStatus = OrderStatus.CREATED;

            await this.validateStatusTransition(order, validateStatus);

            await this.orderService.updateOrderStatus(order, validateStatus, queryRunner);
            await this.orderActionService.createOrderAction(req, order, 'VALIDATE_ORDER', queryRunner);

            this.eventEmitter.emit('order.validated', order.id);

            await queryRunner.commitTransaction();
            await queryRunner.release();
        } catch (error) {
            logger.error('Error validating order:', { message: error.message, stack: error.stack });
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            throw new InternalServerErrorException(error.message);
        }
    }

    async validateStatusTransition(order: Order, newStatus: OrderStatus) {

        if (order.orderStatus === newStatus) {
            throw new BadRequestException('La commande est déjà en ce statut');
        }

        // Empêcher la modification d'une commande complétée ou annulée
        if (order.orderStatus === OrderStatus.COMPLETED || order.orderStatus === OrderStatus.CANCELLED) {
            throw new BadRequestException('Impossible de modifier une commande terminée ou annulée');
        }
    
        // Empêcher le retour à un statut antérieur (sauf pour CANCELLED qui peut être défini depuis n'importe quel statut)
        if (newStatus !== OrderStatus.CANCELLED && order.orderStatus > newStatus) {
            throw new BadRequestException('Transition de statut invalide : Impossible de revenir à un statut antérieur');
        }
    
        // Optionnel : S'assurer que les changements de statut sont séquentiels
        if (newStatus !== OrderStatus.CANCELLED && newStatus - order.orderStatus > 100) {
            throw new BadRequestException('Transition de statut invalide : Le statut doit changer de manière séquentielle');
        }
    }

}
