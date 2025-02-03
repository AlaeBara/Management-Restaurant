import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";

import { MenuItemResponseDto, MenuItemTagResponseDto } from "src/menu-item-management/dtos/public/menu-item-response.public.dto";
import { MenuItemTag } from "src/menu-item-management/entities/menu-item-tag.entity";
import { MenuItem } from "src/menu-item-management/entities/menu-item.entity";

export class MenuItemPublicService {

    constructor(
        @InjectRepository(MenuItem)
        private readonly menuItemRepository: Repository<MenuItem>,
        @InjectRepository(MenuItemTag)
        private readonly menuItemTagRepository: Repository<MenuItemTag>
    ) {}

    async getMenuItem() {
        const menuItems = await this.menuItemRepository.find();

        return plainToInstance(MenuItemResponseDto, menuItems, {
            excludeExtraneousValues: true
        });
    }

    async getMenuItemByTag(tag: string) {
        const menuItems = await this.menuItemRepository.createQueryBuilder('menuItem')
        .leftJoinAndSelect('menuItem.tags', 'tag') // Join the tags relation
        .leftJoinAndSelect('menuItem.translates', 'translates') // Join the choices relation
        .leftJoinAndSelect('translates.language', 'language') // Join the choices relation
        .leftJoinAndSelect('menuItem.discount', 'discount') // Join the choices relationç
        .leftJoinAndSelect('menuItem.images', 'images') // Join the choices relation
        .leftJoinAndSelect('menuItem.recipe', 'recipe') // Join the choices relation
        .leftJoinAndSelect('menuItem.category', 'category') // Join the choices relation
        .where('tag.id = :tagId', { tagId: tag }) // Filter by tag ID
        .getMany();

        return plainToInstance(MenuItemResponseDto, menuItems, {
            excludeExtraneousValues: true
        });
    }

    async fetchAllTags() {
        const tags = await this.menuItemTagRepository.find();

        return plainToInstance(MenuItemTagResponseDto, tags, {
            excludeExtraneousValues: true
        });
    }
}
