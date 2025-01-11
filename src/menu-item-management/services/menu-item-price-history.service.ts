import { DataSource, QueryRunner, Repository } from "typeorm";
import { MenuItemTag } from "../entities/menu-item-tag.entity";
import { GenericService } from "src/common/services/generic.service";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { MenuItemPriceHistory } from "../entities/menu-item-price-history.entity";
import { MenuItem } from "../entities/menu-item.entity";
import { CreateMenuItemPriceDto } from "../dtos/menu-item-price/create-menu-item-price.dto";
import { MenuItemDiscountService } from "./menu-item-discount.service";
import { MenuItemPriceService } from "./menu-item-price.service";
import { MenuItemPrice } from "../entities/menu-item-price.entityt";

@Injectable()
export class MenuItemPriceHistoryService extends GenericService<MenuItemPriceHistory> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(MenuItemPriceHistory)
        readonly priceHistoryRepository: Repository<MenuItemPriceHistory>,
        private readonly discountService: MenuItemDiscountService,
        private readonly priceService: MenuItemPriceService


    ) {
        super(dataSource, MenuItemPriceHistory, 'historique du prix de l\'article menu');
    }

    async createPriceAndHistory(menuItem: MenuItem, dto: CreateMenuItemPriceDto, queryRunner: QueryRunner) {
        const discount = dto.discountId ? 
            await this.discountService.findOneByIdWithOptions(dto.discountId) : null;
    
        const menuItemPrice = this.priceService.priceRepository.create({
            menuItem: menuItem,
            basePrice: dto.basePrice,
            discount: discount,
        });
        await queryRunner.manager.save(MenuItemPrice, menuItemPrice);
    
        const menuItemPriceHistory = this.priceHistoryRepository.create({
            price: menuItemPrice,
            oldPrice: null,
            newPrice: menuItemPrice.basePrice,
        });
        await queryRunner.manager.save(MenuItemPriceHistory, menuItemPriceHistory);
    }
}