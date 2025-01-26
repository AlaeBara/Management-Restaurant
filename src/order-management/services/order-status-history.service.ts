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
import { OrderStatusHistory } from "../entities/order-status-history.entity";

export class OrderStatusHistoryService extends GenericService<OrderStatusHistory> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(OrderStatusHistory)
        private orderStatusHistoryRepository: Repository<OrderStatusHistory>,
    ) {
        super(dataSource, OrderStatusHistory, 'historique de status de commande');
    }
}