import { Body, Controller, Delete, Get, Inject, Param, ParseUUIDPipe, Patch, Post, Put, Query } from "@nestjs/common";
import { MenuItemTagService } from "../services/menu-item-tag.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Inventory } from "src/inventory-managemet/entities/inventory.entity";
import { Permissions } from "src/user-management/decorators/auth.decorator";
import { MenuItemTag } from "../entities/menu-item-tag.entity";
import { UpdateInventoryDto } from "src/inventory-managemet/dtos/inventory/update-inventory.dto";
import { MenuItemService } from "../services/menu-item.service";
import { MenuItem } from "../entities/menu-item.entity";
import { CreateMenuItemDto } from "../dtos/menu-item/create-menu-item.dto";


@Controller('api/menu-items')
@ApiTags('menu-item')
@ApiBearerAuth()
export class MenuItemController {
    constructor(
        @Inject()
        private readonly menuItemService: MenuItemService
    ) {
    }

    @Get()
    @Permissions('view-menu-item-tags')
    @ApiOperation({ summary: 'Get all menu item tags' })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('relations') relations?: string[],
        @Query('sort') sort?: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query() query?: any,
    ): Promise<{ data: MenuItem[]; total: number; page: number; limit: number }> {
        return this.menuItemService.findAll(
            page,
            limit,
            relations,
            sort,
            withDeleted,
            onlyDeleted,
            select,
            query,
        );
    }

    @Post()
    @Permissions('create-menu-item')
    @ApiOperation({ summary: 'Create a menu item' })
    async createMenuItem(@Body() createMenuItemDto: CreateMenuItemDto) {
        await this.menuItemService.createMenuItem(createMenuItemDto);
        return { message: 'Super! Vot produit de menu a été créé avec succès', status: 201 };

    }

    @Get(':id')
    @Permissions('view-menu-item')
    @ApiOperation({ summary: 'Get a menu item by id' })
    async getMenuItem(@Param('id', ParseUUIDPipe) id: string) {
        return this.menuItemService.findOneByIdOrFail(id);
    }

    @Delete(':id')
    @Permissions('delete-menu-item')
    @ApiOperation({ summary: 'Delete a menu item' })
    async deleteMenuItem(@Param('id', ParseUUIDPipe) id: string) {
        await this.menuItemService.deleteMenuItem(id);
        return { message: 'Super! Vot produit de menu a été supprimé avec succès', status: 200 };
    }

    @Patch(':id/restore')
    @Permissions('restore-menu-item')
    @ApiOperation({ summary: 'Restore a menu item' })
    async restoreMenuItem(@Param('id', ParseUUIDPipe) id: string) {
        await this.menuItemService.restoreMenuItem(id);
        return { message: 'Super! Vot produit de menu a été restauré avec succès', status: 200 };
    }

}
