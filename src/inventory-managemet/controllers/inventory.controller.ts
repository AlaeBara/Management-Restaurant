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

    /*    private inventoryPermissions = [
           { name: 'view-inventories', label: 'Voir tous les stocks', resource: 'inventory' },
           { name: 'view-inventory', label: 'Voir un stock spécifique', resource: 'inventory' },
           { name: 'create-inventory', label: 'Créer un nouveau stock', resource: 'inventory' },
           { name: 'update-inventory', label: 'Mettre à jour un stock existant', resource: 'inventory' },
           { name: 'delete-inventory', label: 'Supprimer un stock', resource: 'inventory' },
           { name: 'restore-inventory', label: 'Restaurer un stock supprimé', resource: 'inventory' }
       ]; */

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
        @Query() query?: any,
    ): Promise<{ data: Inventory[]; total: number; page: number; limit: number }> {
        return this.inventoryService.findAll(
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
        return { message: 'Super! Votre nouveau stock a été créé avec succès', status: 201 };
    }

    @Put(':id')
    @Permissions('update-inventory')
    @ApiOperation({ summary: 'Update a inventory' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateInventoryDto: UpdateInventoryDto,
    ) {
        await this.inventoryService.updateInventory(id, updateInventoryDto);
        return { message: 'Super! Votre stock a été modifié avec succès', status: 200 };
    }

    @Delete(':id')
    @Permissions('delete-inventory')
    @ApiOperation({ summary: 'Delete a inventory' })
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        await this.inventoryService.deleteInventory(id);
        return { message: 'Super! Votre stock a été supprimé avec succès', status: 200 };
    }

    @Patch(':id/restore')
    @Permissions('restore-inventory')
    @ApiOperation({ summary: 'Restore a inventory' })
    async restore(@Param('id', ParseUUIDPipe) id: string) {
        await this.inventoryService.findOneByIdWithOptions(id, { onlyDeleted: true });
        await this.inventoryService.restoreByUUID(id, true, ['sku']);
        return { message: 'Super! Votre stock a été restauré avec succès', status: 200 };
    }
}