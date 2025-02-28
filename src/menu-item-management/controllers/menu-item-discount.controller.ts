import { Body, Controller, Delete, Get, HttpCode, Inject, Param, ParseUUIDPipe, Patch, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { Permissions } from "src/user-management/decorators/auth.decorator";
import { MenuItemDiscount } from "../entities/menu-item-discount.entity";
import { MenuItemDiscountService } from "../services/menu-item-discount.service";
import { CreateDiscountDto } from "../dtos/menu-item-discount/create-discount.dto";
import { UpdateDiscountDto } from "../dtos/menu-item-discount/update-discount.dto";

@Controller('api/menu-item-discounts')
@ApiTags('menu-item-discount')
@ApiBearerAuth()
export class MenuItemDiscountController {
    constructor(
        @Inject(MenuItemDiscountService)
        private readonly menuItemDiscountService: MenuItemDiscountService
    ) {
    }

    @Get()
    @Permissions('view-discount')
    @ApiOperation({ summary: 'Get all discounts' })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('relations') relations?: string[],
        @Query('sort') sort?: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query() query?: any,
    ): Promise<{ data: MenuItemDiscount[]; total: number; page: number; limit: number }> {
        return this.menuItemDiscountService.findAll(
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
    @Permissions('view-discount')
    @ApiOperation({ summary: 'Get a discount by id' })
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('relations') relations?: string[],
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query('findOrThrow') findOrThrow?: boolean,
    ): Promise<MenuItemDiscount> {
        return this.menuItemDiscountService.findOneWithoutBuilder(id, {
            relations,
            select,
            withDeleted,
            onlyDeleted,
            findOrThrow,
        });
    }

    @Post()
    @Permissions('manage-discount')
    @ApiOperation({ summary: 'Create a discount' })
    async createDiscount(@Body() createDiscountDto: CreateDiscountDto) {
        await this.menuItemDiscountService.createDiscount(createDiscountDto);
        return {
            message: 'Super! Votre discount a été créé avec succès',
            statusCode: 201
        }
    }

    @Put(':id')
    @Permissions('manage-discount')
    @ApiOperation({ summary: 'Update a discount' })
    async updateDiscount(@Param('id', ParseUUIDPipe) id: string, @Body() updateDiscountDto: UpdateDiscountDto) {
        await this.menuItemDiscountService.updateDiscount(id, updateDiscountDto);
        return { message: 'Super! Votre discount a été modifié avec succès', status: 200 };
    }

    @Delete(':id')
    @Permissions('manage-discount')
    @ApiOperation({ summary: 'Delete a discount' })
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        await this.menuItemDiscountService.deleteDiscount(id);
        return { message: 'Super! Votre discount a été supprimé avec succès', status: 200 };
    }

    @Patch(':id/restore')
    @Permissions('manage-discount')
    @ApiOperation({ summary: 'Restore a menu item tag' })
    async restore(@Param('id', ParseUUIDPipe) id: string) {
        await this.menuItemDiscountService.restoreByUUID(id, true, ['discountSku']);
        return { message: 'Super! Votre discount a été restauré avec succès', status: 200 };
    }
}