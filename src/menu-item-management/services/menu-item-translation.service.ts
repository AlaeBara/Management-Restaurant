import { DataSource, QueryRunner, Repository } from "typeorm";
import { MenuItemTag } from "../entities/menu-item-tag.entity";
import { GenericService } from "src/common/services/generic.service";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { MenuItemTranslate } from "../entities/menu-item-translation.enity";
import { MenuItem } from "../entities/menu-item.entity";

@Injectable()
export class MenuItemTranslationService extends GenericService<MenuItemTranslate> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(MenuItemTranslate)
        readonly translationRepository: Repository<MenuItemTranslate>,

    ) {
        super(dataSource, MenuItemTranslate, 'translate menu item');
    }

    async softDeleteTranslations(menuItem: MenuItem, queryRunner: QueryRunner) {
        await queryRunner.manager.softDelete(MenuItemTranslate, { menuItem: { id: menuItem.id } });
    }

    async restoreTranslations(menuItem: MenuItem, queryRunner: QueryRunner) {
        await queryRunner.manager.restore(MenuItemTranslate, { menuItem: { id: menuItem.id } });
    }
}