import { forwardRef, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { GenericService } from "src/common/services/generic.service";
import { Order } from "src/order-management/entities/order.entity";
import { DataSource, QueryRunner, Repository } from "typeorm";
import { OrderItemService } from "../order-item.service";
import { MenuItemService } from "src/menu-item-management/services/menu-item.service";
import { OrderService } from "../order.service";

export class OrderEventService extends GenericService<Order> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @Inject(OrderItemService)
        private orderItemService: OrderItemService,
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

    async deductMenuItemQuantityNoRecipe(orderId: string, queryRunner: QueryRunner) {
        try {
            // Fetch order with necessary relations
            const order = await this.orderRepository
                .createQueryBuilder('order')
                .leftJoinAndSelect('order.orderItems', 'orderItem')
                .leftJoinAndSelect('orderItem.product', 'product')
                .where('order.id = :id', { id: orderId })
                .getOne();

            // Filter items without recipe and prepare updates
            const itemsToUpdate = order.orderItems
                .filter(orderItem => !orderItem.product.hasRecipe)
                .map(orderItem => ({
                    id: orderItem.product.id,
                    newQuantity: orderItem.product.quantity - orderItem.quantity
                }));

            // Execute all updates in parallel within the transaction
            await Promise.all(
                itemsToUpdate.map(item =>
                    this.menuItemService.updateQuantity(
                        item.id,
                        item.newQuantity,
                        queryRunner
                    )
                )
            );
        } catch (error) {
            console.error('Failed to deduct menu item quantities:', error);
            throw new Error('Failed to update menu item quantities');
        }
    }

}