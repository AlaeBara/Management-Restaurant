import { DataSource, QueryRunner, Repository } from "typeorm";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

import { GenericService } from "src/common/services/generic.service";
import { MenuItemTranslate } from "../entities/menu-item-translation.enity";
import { MenuItem } from "../entities/menu-item.entity";
import { LanguageService } from "src/language-management/services/langague.service";
import { CreateMenuItemTranslate } from "../dtos/menu-item-translate/create-menu-item-translation.dto";

@Injectable()
export class MenuItemTranslationService extends GenericService<MenuItemTranslate> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(MenuItemTranslate)
        readonly translationRepository: Repository<MenuItemTranslate>,
        private readonly languageService: LanguageService

    ) {
        super(dataSource, MenuItemTranslate, 'translate menu item');
    }

     async createTranslation(menuItem: MenuItem, dto: CreateMenuItemTranslate, queryRunner: QueryRunner) {
        const language = await this.languageService.getLanguageByCode(dto.languageId);
        const translation = this.translationRepository.create({
                menuItem: menuItem,
                language: language,
                name: dto.name,
            description: dto.description,
        });
    
        await queryRunner.manager.save(MenuItemTranslate, translation);
    }

    async softDeleteTranslations(menuItem: MenuItem, queryRunner: QueryRunner) {
        await queryRunner.manager.softDelete(MenuItemTranslate, { menuItem: { id: menuItem.id } });
    }

    async restoreTranslations(menuItem: MenuItem, queryRunner: QueryRunner) {
        await queryRunner.manager.restore(MenuItemTranslate, { menuItem: { id: menuItem.id } });
    }
}