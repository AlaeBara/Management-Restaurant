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
import { OrderItem } from "../entities/order-item.entity";
import { CreateOrderItemDto } from "../dtos/order-item/create-order-item.dto";
import { Order } from "../entities/order.entity";
import { MenuItem } from "src/menu-item-management/entities/menu-item.entity";
import { MenuItemService } from "src/menu-item-management/services/menu-item.service";
import { Inject } from "@nestjs/common";
import { InventoryMovementService } from "src/inventory-managemet/services/inventory-movement.service";
import { MenuItemRecipeService } from "src/menu-item-management/services/menu-item-recipe.service";

export class OrderItemService extends GenericService<OrderItem> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(OrderItem)
        public orderItemRepository: Repository<OrderItem>,
        @Inject(MenuItemService)
        private menuItemService: MenuItemService,
        @Inject(InventoryMovementService)
        private inventoryMovementService: InventoryMovementService,
        @Inject(MenuItemRecipeService)
        private menuItemRecipeService: MenuItemRecipeService
    ) {
        super(dataSource, OrderItem, 'article de commande');
    }

    async createOrderItem(createOrderItemDto: CreateOrderItemDto, order: Order, queryRunner: QueryRunner) {
        const orderItem = this.orderItemRepository.create(createOrderItemDto);
        
        orderItem.order = order;
        orderItem.product = await this.menuItemService.findOneByIdWithOptions(createOrderItemDto.productId);
        orderItem.fullLabel = await this.getItemLabel(orderItem);
        await queryRunner.manager.save(OrderItem, orderItem);

        return orderItem;
    }

    async getItemLabel(orderItem: OrderItem): Promise<string> {
        return orderItem.choices ? orderItem.product.name + " - " + orderItem.choices.choice.value : orderItem.product.name;
    }

    /* async updateMenuItemQuantity(orderItem: OrderItem, order: Order, queryRunner: QueryRunner) {
        const menuItem = orderItem.product;
        if (menuItem.hasRecipe) {
            await this.menuItemRecipeService.executeMovements(order.orderItems, menuItem, order, queryRunner);
        } else {
            await this.menuItemRecipeService.updateQuantity(menuItem, orderItem.quantity, queryRunner);
        }

    } */

}