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
import { OrderItem } from "../entities/order-item.entity";

export class OrderItemService extends GenericService<OrderItem> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>,
    ) {
        super(dataSource, OrderItem, 'article de commande');
    }
}