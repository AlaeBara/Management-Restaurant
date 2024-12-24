import { DataSource, Repository } from "typeorm";
import { MenuItemTag } from "../entities/menu-item-tag.entity";
import { GenericService } from "src/common/services/generic.service";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { MenuItemPriceHistory } from "../entities/menu-item-price-history.entity";

@Injectable()
export class MenuItemPriceHistoryService extends GenericService<MenuItemPriceHistory> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(MenuItemPriceHistory)
        readonly menuItemPriceHistoryRepository: Repository<MenuItemPriceHistory>,

    ) {
        super(dataSource, MenuItemPriceHistory, 'historique du prix de l\'article menu');
    }
}