import { Body, Controller, Delete, forwardRef, Get, Inject, Param, ParseUUIDPipe, Patch, Post, Put, Query, Req, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { MenuItemTagService } from "../services/menu-item-tag.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Inventory } from "src/inventory-managemet/entities/inventory.entity";
import { Permissions } from "src/user-management/decorators/auth.decorator";
import { MenuItemTag } from "../entities/menu-item-tag.entity";
import { UpdateInventoryDto } from "src/inventory-managemet/dtos/inventory/update-inventory.dto";
import { MenuItemService } from "../services/menu-item.service";
import { MenuItem } from "../entities/menu-item.entity";
import { CreateMenuItemDto } from "../dtos/menu-item/create-menu-item.dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { AddChoiceToMenuItemDto } from "../dtos/menu-item-choices/add-choice-to-menu-item.dto";
import { MenuItemChoiceService } from "../services/menu-item-choice.service";


@Controller('api/menu-items')
@ApiTags('menu-item')
@ApiBearerAuth()
export class MenuItemController {
    constructor(
        @Inject(forwardRef(() => MenuItemService))
        private readonly menuItemService: MenuItemService,
        @Inject(forwardRef(() => MenuItemChoiceService))
        private readonly menuItemChoiceService: MenuItemChoiceService
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
    @UseInterceptors(FilesInterceptor('images', 10))
    async createMenuItem(@Body() createMenuItemDto: CreateMenuItemDto, @UploadedFiles() images: Array<Express.Multer.File>,@Req() req: Request) {
        createMenuItemDto.images = images;
        await this.menuItemService.createMenuItem(createMenuItemDto, req); 
        return { message: 'Super! Votre produit de menu a été créé avec succès', status: 201 };
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
        return { message: 'Super! Votre produit de menu a été supprimé avec succès', status: 200 };
    }

    @Patch(':id/restore')
    @Permissions('restore-menu-item')
    @ApiOperation({ summary: 'Restore a menu item' })
    async restoreMenuItem(@Param('id', ParseUUIDPipe) id: string) {
        await this.menuItemService.restoreMenuItem(id);
        return { message: 'Super! Votre produit de menu a été restauré avec succès', status: 200 };
    }

    @Post('choices')
    @Permissions('add-choice-to-menu-item')
    @ApiOperation({ summary: 'Add a choice to a menu item' })
    async addChoiceToMenuItem(@Body() addChoiceToMenuItemDto: AddChoiceToMenuItemDto) {
        await this.menuItemChoiceService.addChoiceToMenuItem(addChoiceToMenuItemDto);
        return { message: 'Super! Votre choix a été ajouté avec succès', status: 201 };
    }

}
