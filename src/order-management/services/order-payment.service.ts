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
import { OrderPayment } from "../entities/order-payment.entity";

export class OrderPaymentService extends GenericService<OrderPayment> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(OrderPayment)
        private orderPaymentRepository: Repository<OrderPayment>,
    ) {
        super(dataSource, OrderPayment, 'paiement');
    }
    
}