import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { InventoryService } from "../services/inventory.service";
import { Permissions } from "src/user-management/decorators/auth.decorator";
import { Inventory } from "../entities/inventory.entity";
import { CreateInventoryDto } from "../dtos/inventory/create-inventory.dto";
import { UpdateInventoryDto } from "../dtos/inventory/update-inventory.dto";


@Controller('api/inventories')
@ApiTags('Inventory Management - Inventories')
@ApiBearerAuth()
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) {
    }

    @Get()
    @Permissions('view-inventories')
    @ApiOperation({ summary: 'Get all inventories' })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('relations') relations?: string[],
        @Query('sort') sort?: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
    ): Promise<{ data: Inventory[]; total: number; page: number; limit: number }> {
        return this.inventoryService.findAll(
            page,
            limit,
            relations,
            sort,
            withDeleted,
            onlyDeleted,
            select,
        );
    }


    @Get(':id')
    @Permissions('view-inventory')
    @ApiOperation({ summary: 'Get an inventory by id' })
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('relations') relations?: string[],
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query('findOrThrow') findOrThrow?: boolean,
    ): Promise<Inventory> {
        // return this.inventoryService.findOneByIdWithOptionsV2(id);
        return this.inventoryService.findOneWithoutBuilder(id, {
            relations,
            select,
            withDeleted,
            onlyDeleted,
            findOrThrow,
        });
    }

    @Post()
    @Permissions('create-inventory')
    @ApiOperation({ summary: 'Create a inventory' })
    async create(@Body() createInventoryDto: CreateInventoryDto) {
        await this.inventoryService.createInventory(createInventoryDto);
        return { message: 'Great! Your new inventory has been created successfully', status: 201 };
    }

    @Put(':id')
    @Permissions('update-inventory')
    @ApiOperation({ summary: 'Update a inventory' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateInventoryDto: UpdateInventoryDto,
    ) {
        await this.inventoryService.updateInventory(id, updateInventoryDto);
        return { message: 'Great! Your inventory has been updated successfully', status: 200 };
    }

    @Delete(':id')
    @Permissions('delete-inventory')
    @ApiOperation({ summary: 'Delete a inventory' })
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        return await this.inventoryService.deleteInventory(id);
    }

    @Patch(':id/restore')
    @Permissions('restore-inventory')
    @ApiOperation({ summary: 'Restore a inventory' })
    async restore(@Param('id', ParseUUIDPipe) id: string) {
        await this.inventoryService.findOneByIdWithOptions(id, { onlyDeleted: true });
        return this.inventoryService.restoreByUUID(id, true, ['storageCode']);
    }
}