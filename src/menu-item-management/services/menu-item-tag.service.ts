import { DataSource, Repository } from "typeorm";
import { MenuItemTag } from "../entities/menu-item-tag.entity";
import { GenericService } from "src/common/services/generic.service";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { CreateMenuItemTagDto } from "../dtos/menu-item-tag/create-menu-item-tag.dto";
import { MenuItem } from "../entities/menu-item.entity";
import { UpdateMenuItemTagDto } from "../dtos/menu-item-tag/update-menu-item-tag.dto";

@Injectable()
export class MenuItemTagService extends GenericService<MenuItemTag> {
    
    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(MenuItemTag)
        readonly menuItemTagRepository: Repository<MenuItemTag>,
        @InjectRepository(MenuItem)
        readonly menuItemRepository: Repository<MenuItem>,

    ) {
        super(dataSource, MenuItemTag, 'tag');
    }

    async createMenuItemTag(createMenuItemTagDto: CreateMenuItemTagDto) {
        const menuItemTag = this.menuItemTagRepository.create({ tag: createMenuItemTagDto.tag.toLowerCase() });
        await this.validateUnique({ tag: menuItemTag.tag });
        return this.menuItemTagRepository.save(menuItemTag);
    }

    async updateMenuItemTag(id: string, updateMenuItemTagDto: UpdateMenuItemTagDto) {
        await this.validateUniqueExcludingSelf({ tag: updateMenuItemTagDto.tag.toLowerCase() }, id);
        await this.isTagInUse(id, 'update', updateMenuItemTagDto); // check if the tag is in use in the menu item
        const menuItemTag = await this.findOneByIdWithOptions(id);
        Object.assign(menuItemTag, {...updateMenuItemTagDto, tag: updateMenuItemTagDto.tag.toLowerCase()});
        return this.menuItemTagRepository.save(menuItemTag);
    }

    async deleteMenuItemTag(id: string) {
        await this.isTagInUse(id, 'delete');
        return this.softDelete(id, true);
    }

    /**
     * Checks if a tag is currently being used by any menu items
     * @param tagId The ID of the tag to check
     * @returns True if the tag is in use, false otherwise
     */
    public async countTagInUse(tagId: string): Promise<boolean> {
        const count = await this.menuItemRepository.count({
            where: { tags: { id: tagId } },
            withDeleted: false
        });
        return count > 0;
    }

    /**
     * Validates if a tag can be deleted or updated based on its usage
     * @param tagId The ID of the tag to check
     * @param action The action being performed ('delete' or 'update')
     * @param updateMenuItemTagDto Optional DTO containing update data
     * @throws ConflictException if trying to delete a tag in use
     * @throws BadRequestException if trying to update a tag in use without validation
     */
    public async isTagInUse(tagId: string, action: 'delete' | 'update', updateMenuItemTagDto?: UpdateMenuItemTagDto): Promise<void> {
        const isInUse = await this.countTagInUse(tagId);
        if (!isInUse) return;

        // If trying to delete a tag that's in use, throw an error
        // If trying to update a tag that's in use, require explicit validation
        switch (action) {
            case 'delete':
                // Never allow deletion of tags in use by menu items
                throw new ConflictException('Impossible de supprimer un tag qui est utilisé par des éléments du menu');
            case 'update':
                // Allow update if validate=true is provided, otherwise warn about impacts
                if(updateMenuItemTagDto.validate) return;
                throw new BadRequestException(
                    `Ce tag est actuellement utilisé par des éléments du menu. ` +
                    `La modification du nom du tag à "${updateMenuItemTagDto.tag}" ` + 
                    `affectera tous les éléments qui l'utilisent. ` +
                    `Pour confirmer cette modification, veuillez inclure validate=true.`
                );
        }
    }
}