import {
    InjectDataSource,
    InjectRepository
} from "@nestjs/typeorm";
import {
    DataSource,
    DeepPartial,
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
import { PublicCreateOrderItemDto } from "../dtos/public/order-item/create-order-item.public.dto";

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

    async createOrderItem(createOrderItemDto: CreateOrderItemDto | PublicCreateOrderItemDto, order: Order, queryRunner: QueryRunner): Promise<OrderItem> {
        const orderItem = this.orderItemRepository.create(createOrderItemDto);

        orderItem.order = order;
        orderItem.product = await this.menuItemService.findOneByIdWithOptions(createOrderItemDto.productId);

        return await queryRunner.manager.save(OrderItem, orderItem);
    }

    async getItemLabel(orderItem: OrderItem): Promise<string> {
        return orderItem.choices ? orderItem.product.name + " (" + orderItem.choices.map(choice => choice.choice.value).join(', ') + ")" : orderItem.product.name;
    }

    async updateOrderItemLabel(id: string, queryRunner: QueryRunner) {
        const orderItem = await queryRunner.manager.findOne(OrderItem, { 
            where: { id }, 
            relations: ['choices', 'choices.choice', 'product'] 
        });
        
        if (!orderItem) {
            throw new Error(`Order item with id ${id} not found`);
        }
        
        // Get valid choice values (filter out undefined/null values)
        const choiceValues = orderItem.choices
            ?.map(choice => choice.choice?.value)
            .filter(value => value) || [];
        
        // Only create the choices string if there are actual values
        let label = orderItem.product.name;
        
        if (choiceValues.length > 0) {
            label += ` (${choiceValues.join(', ')})`;
        }
        
        orderItem.fullLabel = label;
        return await queryRunner.manager.save(orderItem);
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