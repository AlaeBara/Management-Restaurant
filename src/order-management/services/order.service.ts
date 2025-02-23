import {
    InjectDataSource,
    InjectRepository
} from "@nestjs/typeorm";
import {
    DataSource,
    Repository,
} from "typeorm";

import { GenericService } from "src/common/services/generic.service";
import logger from "src/common/Loggers/logger";
import { Order } from "../entities/order.entity";
import { OrderItemService } from "./order-item.service";
import { forwardRef, Inject, NotFoundException } from "@nestjs/common";
import { TableService } from "src/zone-table-management/services/table.service";
import { UserService } from "src/user-management/services/user/user.service";
import { ClientService } from "src/client-management/services/client.service";
import { GuestService } from "./guest.service";
import { MenuItemService } from "src/menu-item-management/services/menu-item.service";
import { MenuItemTranslationService } from "src/menu-item-management/services/menu-item-translation.service";
import { CreateOrderDto } from "../dtos/order/create-order.dto";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { OrderActionService } from "./order-action.service";
import { plainToInstance } from "class-transformer";
import { OrderResponsePublicDto } from "../dtos/public/order/order-response.public.dto";

export class OrderService extends GenericService<Order> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @Inject(OrderItemService)
        private orderItemService: OrderItemService,
        @Inject(TableService)
        private tableService: TableService,
        @Inject(UserService)
        private userService: UserService,
        @Inject(ClientService)
        private clientService: ClientService,
        @Inject(GuestService)
        private guestService: GuestService,
        @Inject(forwardRef(() => MenuItemTranslationService))
        private menuItemTranslationService: MenuItemTranslationService,
        @Inject(MenuItemService)
        private menuItemService: MenuItemService,
        @Inject(OrderActionService)
        private orderActionService: OrderActionService,
        private eventEmitter: EventEmitter2,
    ) {
        super(dataSource, Order, 'commande');
    }

    async inizializeQueryRunner() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        return queryRunner;
    }

    async createOrderByStaff(createOrderDto: CreateOrderDto, req: Request) {
        const queryRunner = await this.inizializeQueryRunner();

        try {
            const order = this.orderRepository.create(createOrderDto);

            const [table] = await Promise.all([
                this.tableService.findOneByIdWithOptions(createOrderDto.tableId),
            ]);

            order.table = table;
            const savedOrder = await queryRunner.manager.save(order);

            order.orderItems = await Promise.all(createOrderDto.items.map(async (orderItem) => {
                return await this.orderItemService.createOrderItem(orderItem, savedOrder, queryRunner);
            }));

            await this.orderActionService.createOrderAction(req, savedOrder, 'CREATED_BY_WAITER', queryRunner);

            await queryRunner.commitTransaction();

            return order.orderNumber;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findOrderByIdOrOrderNumber(idOrOrderNumber: string) {
        const order = await this.orderRepository.findOne({
            where: [{ orderNumber: idOrOrderNumber }, { id: idOrOrderNumber }],
            relations: ['orderItems', 'orderPayments', 'orderStatusHistory', 'orderActions', 'table']
        });

        if (!order) {
            throw new NotFoundException('Aucune commande trouvée');
        }

        return order;
    }
}