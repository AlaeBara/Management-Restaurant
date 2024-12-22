import { DataSource, Repository } from "typeorm";
import { MenuItemTag } from "../entities/menu-item-tag.entity";
import { GenericService } from "src/common/services/generic.service";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { MenuItemTranslate } from "../entities/menu-item-translation.enity";
import { MenuItemPrice } from "../entities/menu-item-price.entityt";

@Injectable()
export class MenuItemPriceService extends GenericService<MenuItemPriceService> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(MenuItemPrice)
        readonly menuItemPriceRepository: Repository<MenuItemPrice>,

    ) {
        super(dataSource, MenuItemPrice, 'prix de l\'article menu');
    }
}