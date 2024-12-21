import { Body, Controller, Delete, Get, Inject, Param, ParseUUIDPipe, Patch, Post, Put, Query } from "@nestjs/common";
import { MenuItemTagService } from "../services/menu-item-tag.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Inventory } from "src/inventory-managemet/entities/inventory.entity";
import { Permissions } from "src/user-management/decorators/auth.decorator";
import { MenuItemTag } from "../entities/menu-item-tag.entity";
import { UpdateInventoryDto } from "src/inventory-managemet/dtos/inventory/update-inventory.dto";
import { CreateMenuItemTagDto } from "../dtos/menu-item-tag/create-menu-item-tag.dto";
import { UpdateMenuItemTagDto } from "../dtos/menu-item-tag/update-menu-item-tag.dto";


@Controller('api/menu-item-tags')
@ApiTags('menu-item-tag')
@ApiBearerAuth()
export class MenuItemTagController {
    constructor(
        @Inject()
        private readonly menuItemTagService: MenuItemTagService
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
    ): Promise<{ data: MenuItemTag[]; total: number; page: number; limit: number }> {
        return this.menuItemTagService.findAll(
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

    @Get(':id')
    @Permissions('view-menu-item-tags')
    @ApiOperation({ summary: 'Get a menu item tag by id' })
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('relations') relations?: string[],
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query('findOrThrow') findOrThrow?: boolean,
    ): Promise<MenuItemTag> {
        return this.menuItemTagService.findOneWithoutBuilder(id, {
            relations,
            select,
            withDeleted,
            onlyDeleted,
            findOrThrow,
        });
    }

    @Post()
    @Permissions('create-menu-item-tag')
    @ApiOperation({ summary: 'Create a menu item tag' })
    async create(@Body() createMenuItemTagDto: CreateMenuItemTagDto) {
        await this.menuItemTagService.createMenuItemTag(createMenuItemTagDto);
        return { message: 'Super! Votre nouvelle étiquette a été créée avec succès', status: 201 };
    }

    @Put(':id')
    @Permissions('update-menu-item-tag')
    @ApiOperation({ summary: 'Update a menu item tag' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateMenuItemTagDto: UpdateMenuItemTagDto,
    ) {
        await this.menuItemTagService.updateMenuItemTag(id, updateMenuItemTagDto);
        return { message: 'Super! Votre étiquette a été modifiée avec succès', status: 200 };
    }

    @Delete(':id')
    @Permissions('delete-menu-item-tag')
    @ApiOperation({ summary: 'Delete a menu item tag' })
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        await this.menuItemTagService.deleteMenuItemTag(id);
        return { message: 'Super! Votre étiquette a été supprimée avec succès', status: 200 };
    }

    @Patch(':id/restore')
    @Permissions('restore-menu-item-tag')
    @ApiOperation({ summary: 'Restore a menu item tag' })
    async restore(@Param('id', ParseUUIDPipe) id: string) {
        await this.menuItemTagService.restoreByUUID(id, true, ['tag']);
        return { message: 'Super! Votre étiquette a été restaurée avec succès', status: 200 };
    }
}
