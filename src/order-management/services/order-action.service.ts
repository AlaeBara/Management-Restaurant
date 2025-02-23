import { Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, QueryRunner } from "typeorm";
import { Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";

import { GenericService } from "src/common/services/generic.service";
import { OrderAction } from "../entities/order-action.entity";
import { Order } from "../entities/order.entity";
import { UserService } from "src/user-management/services/user/user.service";

export class OrderActionService extends GenericService<OrderAction> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(OrderAction)
        private orderActionRepository: Repository<OrderAction>,
        @Inject(UserService)
        private userService: UserService,

    ) {
        super(dataSource, OrderAction, 'order_action');
    }

    async createOrderAction(request: Request, orderId: Order, action: string, queryRunner?: QueryRunner) {
        const user = await this.userService.findUserByRequest(request);
        const orderAction = new OrderAction();
        orderAction.order = orderId;
        orderAction.action = action;
        orderAction.actionBy = user;
        return queryRunner ? queryRunner.manager.save(orderAction) : this.orderActionRepository.save(orderAction);
    }
}
