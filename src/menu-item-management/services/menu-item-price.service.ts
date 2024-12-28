import { DataSource, QueryRunner, Repository } from "typeorm";
import { MenuItemTag } from "../entities/menu-item-tag.entity";
import { GenericService } from "src/common/services/generic.service";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { MenuItemTranslate } from "../entities/menu-item-translation.enity";
import { MenuItemPrice } from "../entities/menu-item-price.entityt";
import { MenuItem } from "../entities/menu-item.entity";

@Injectable()
export class MenuItemPriceService extends GenericService<MenuItemPrice> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(MenuItemPrice)
        readonly priceRepository: Repository<MenuItemPrice>,

    ) {
        super(dataSource, MenuItemPrice, 'prix de l\'article menu');
    }

    async softDeletePrice(menuItem: MenuItem, queryRunner: QueryRunner) {
        await queryRunner.manager.softDelete(MenuItemPrice, { id: menuItem.price.id });
    }

    async restorePrice(menuItem: MenuItem, queryRunner: QueryRunner) {
        await queryRunner.manager.restore(MenuItemPrice, { id: menuItem.price.id });
    }
}