import { DataSource, Repository } from "typeorm";
import { MenuItemTag } from "../entities/menu-item-tag.entity";
import { GenericService } from "src/common/services/generic.service";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { MenuItemTranslate } from "../entities/menu-item-translation.enity";

@Injectable()
export class MenuItemTranslationService extends GenericService<MenuItemTranslate> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(MenuItemTranslate)
        readonly translationRepository: Repository<MenuItemTranslate>,

    ) {
        super(dataSource, MenuItemTranslate, 'translate menu item');
    }
}