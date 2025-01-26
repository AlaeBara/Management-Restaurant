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

export class OrderService extends GenericService<Order> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
    ) {
        super(dataSource, Order, 'commande');
    }
}