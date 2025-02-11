import {
    InjectDataSource,
    InjectRepository
} from "@nestjs/typeorm";
import {
    DataSource,
    QueryRunner,
    Repository,
} from "typeorm";

import { GenericService } from "src/common/services/generic.service";
import logger from "src/common/Loggers/logger";
import { Order } from "../entities/order.entity";
import { CreateOrderDto } from "../dtos/order/create-order.dto";
import { OrderItemService } from "./order-item.service";
import { forwardRef, Inject } from "@nestjs/common";
import { TableService } from "src/zone-table-management/services/table.service";
import { UserService } from "src/user-management/services/user/user.service";
import { ClientService } from "src/client-management/services/client.service";
import { GuestService } from "./guest.service";
import { OrderItem } from "../entities/order-item.entity";
import { Languages } from "src/language-management/enums/languages.enum";
import { MenuItemService } from "src/menu-item-management/services/menu-item.service";
import { MenuItemTranslate } from "src/menu-item-management/entities/menu-item-translation.enity";
import { MenuItemTranslationService } from "src/menu-item-management/services/menu-item-translation.service";
import { MenuItemChoices } from "src/menu-item-management/entities/choices/menu-item-choices.entity";

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
    ) {
        super(dataSource, Order, 'commande');
    }

    async inizializeQueryRunner() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        return queryRunner;
    }

    async createOrder(createOrderDto: CreateOrderDto, req: Request) {
        const queryRunner = await this.inizializeQueryRunner();
        const order = this.orderRepository.create(createOrderDto);

        const [table] = await Promise.all([
            this.tableService.findOneByIdWithOptions(createOrderDto.tableId),
        ]);

        order.table = table;
        const savedOrder = await queryRunner.manager.save(order);

        order.orderItems = await Promise.all(createOrderDto.items.map(async (orderItem) => {
            return await this.orderItemService.createOrderItem(orderItem, savedOrder, queryRunner);
        }));

        await queryRunner.commitTransaction();

        return savedOrder;

    }


}