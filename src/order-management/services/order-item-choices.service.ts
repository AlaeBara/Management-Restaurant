import { Inject } from "@nestjs/common";
import { MenuItemChoiceService } from "src/menu-item-management/services/menu-item-choice.service";
import { OrderItem } from "../entities/order-item.entity";
import { QueryRunner } from "typeorm";
import { In } from "typeorm";
import { MenuItemChoices } from "src/menu-item-management/entities/choices/menu-item-choices.entity";

export class OrderItemChoicesService  {

    constructor(
      @Inject(MenuItemChoiceService)
      private MenuItemChoiceService: MenuItemChoiceService,
    ) {
    }

    async insertBatchChoicesToOrderItem(orderItem: OrderItem, choices: string[], queryRunner: QueryRunner): Promise<MenuItemChoices[]> {
        const choiceIds = choices.map(choice => choice);
        const choiceObjects = await queryRunner.manager.find(MenuItemChoices, { where: { id: In(choiceIds) } });
        
        // Associate choices with order item
        orderItem.choices = choiceObjects;
        await queryRunner.manager.save(orderItem);
        
        return choiceObjects;
    }
}