import { Controller, Get, Param } from "@nestjs/common";

import { MenuItemPublicService } from "src/menu-item-management/services/public/menu-item.public.service";
import { Public } from "src/user-management/decorators/auth.decorator";

@Controller('api/public/menu-items')
export class MenuItemPublicController {
    constructor(private readonly menuItemPublicService: MenuItemPublicService) {}

    @Get()
    @Public()
    async getMenuItem() {
        return this.menuItemPublicService.getMenuItem();
    }

    @Get('tag/:tag')
    @Public()
    async getMenuItemByTag(@Param('tag') tag: string) {
        return this.menuItemPublicService.getMenuItemByTag(tag);
    }

    @Get('tags')
    @Public()
    async fetchAllTags() {
        return this.menuItemPublicService.fetchAllTags();
    }
}
