import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { InventoryMovementService } from "../services/inventory-movement.service";
import { Permissions } from "src/user-management/decorators/auth.decorator";
import { InventoryMovement } from "../entities/inventory-movement.entity";
import { CreateInventoryMovementDto } from "../dtos/inventory-movement/create-inventory-movement.dto";
import { CreateInvenotryTransfer } from "../dtos/inventory-movement/create-inventory-transfer.dto";

@Controller('api/inventories-movements')
@ApiTags('Inventory Management - Inventories Movements')
@ApiBearerAuth()
export class InvetoryMovementController {

    constructor(private readonly inventoryMovementService: InventoryMovementService) { }

    /*  private inventoryMovementPermissions = [
         { name: 'view-inventories-movements', label: 'View all inventory movements', resource: 'inventory-movement' },
         { name: 'create-inventory-movement', label: 'Create new inventory movement', resource: 'inventory-movement' },
     ]; */

    @Get()
    @Permissions('view-inventories-movements')
    @ApiOperation({ summary: 'Get all inventories Movements' })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('relations') relations?: string[],
        @Query('sort') sort?: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query() query?: any,
    ): Promise<{ data: InventoryMovement[]; total: number; page: number; limit: number }> {
        return this.inventoryMovementService.findAll(
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

    @Get('by-inventory/:id')
    @Permissions('view-inventories-movements')
    @ApiOperation({ summary: 'Get all inventories Movements by inventory id' })
    async findAllByInventoryId(
        @Param('id', ParseUUIDPipe) id: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('relations') relations?: string[],
        @Query('sort') sort?: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query() query?: any,
    ): Promise<{ data: InventoryMovement[]; total: number; page: number; limit: number }> {
        return await this.inventoryMovementService.findAll(
            page,
            limit,
            relations,
            sort,
            withDeleted,
            onlyDeleted,
            select,
            query,
            [
                { inventory: { id } },
                { transfertToInventory: { id } }
            ],
        );
    }

    @Post()
    @Permissions('create-inventory-movement')
    @ApiOperation({ summary: 'Create a inventory movement' })
    async create(@Body() createInventoryMovementDto: CreateInventoryMovementDto, @Req() request: Request) {
        await this.inventoryMovementService.createInvenotryMovement(createInventoryMovementDto, request);
        return { message: 'Super! Votre déplacement de stock a été créé avec succès', status: 201 };
    }

    @Post('transfer')
    @Permissions('create-transfer-inventory-movement')
    @ApiOperation({ summary: 'Create Transfer inventory movement' })
    async createTransfer(@Body() createInvenotryTransfer: CreateInvenotryTransfer, @Req() request: Request) {
        await this.inventoryMovementService.createTransfer(createInvenotryTransfer, request);
        return { message: 'Super! Votre transfert de stock a été créé avec succès', status: 201 };
    }
}