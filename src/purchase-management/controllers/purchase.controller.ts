import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { PurchaseService } from "../services/purchase.service";
import { Permissions } from "src/user-management/decorators/auth.decorator";
import { CreatePurchaseDto } from "../dtos/create-purchase.dto";
import { ExecutePurchaseMovementDto } from "../dtos/execute-purchase-movement.dto";
import { Purchase } from "../entities/purchase.entity";
import { CreatePurchaseItemDto } from "../dtos/create-purchase-item.dto";

@Controller('api/purchases')
@ApiTags('Purchase Management - Purchases')
@ApiBearerAuth()
export class PurchaseController {
    constructor(private readonly purchaseService: PurchaseService) { }

    /* private readonly purchasePermissions = [
        { name: 'view-purchases', label: 'Voir toutes les commandes d\'achat', resource: 'Achat' },
        { name: 'view-purchase', label: 'Voir une commande d\'achat spécifique', resource: 'Achat' },
        { name: 'create-purchase', label: 'Créer une nouvelle commande d\'achat', resource: 'Achat' },
        { name: 'delete-purchase', label: 'Supprimer une commande d\'achat', resource: 'Achat' },
        { name: 'create-purchase-item', label: 'Créer une ligne de commande d\'achat', resource: 'Achat' },
        { name: 'delete-purchase-item', label: 'Supprimer une ligne de commande d\'achat', resource: 'Achat' },
        { name: 'execute-purchase-movement', label: 'Exécuter un déplacement de ligne de commande d\'achat', resource: 'Achat' }
    ]; */

    @Get()
    @Permissions('view-purchases')
    @ApiOperation({ summary: 'Get all purchases' })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('relations') relations?: string[],
        @Query('sort') sort?: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query() query?: any,
    ): Promise<{ data: Purchase[]; total: number; page: number; limit: number }> {
        return this.purchaseService.findAll(
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
    @Permissions('view-purchase')
    @ApiOperation({ summary: 'Get a purchase by id' })
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('relations') relations?: string[],
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query('findOrThrow') findOrThrow?: boolean,
    ): Promise<Purchase> {
        return this.purchaseService.findOneWithoutBuilder(id, {
            relations,
            select,
            withDeleted,
            onlyDeleted,
            findOrThrow,
        });
    }

    @Post()
    @Permissions('create-purchase')
    @ApiOperation({ summary: 'Create a new purchase' })
    async create(@Body() createPurchaseDto: CreatePurchaseDto, @Req() request: Request) {
        await this.purchaseService.createPurchase(createPurchaseDto, request);
        return { message: 'Super! Votre commande d\'achat a été créée avec succès', status: 201 };
    }

    @Delete('/items/:id')
    @Permissions('delete-purchase-item')
    @ApiOperation({ summary: 'Delete a purchase item' })
    async deleteItem(@Param('id', ParseUUIDPipe) id: string) {
        await this.purchaseService.deleteItem(id);
        return { message: 'Super! Votre ligne de commande d\'achat a été supprimée avec succès', status: 200 };
    }

    @Post('/items/:id/execute-movement')
    @Permissions('execute-purchase-movement')
    @ApiOperation({ summary: 'Execute a purchase movement' })
    async executeMovement(@Param('id', ParseUUIDPipe) id: string, @Body() executePurchaseMovementDto: ExecutePurchaseMovementDto, @Req() request: Request) {
        await this.purchaseService.executePurchaseMovement(executePurchaseMovementDto, request);
        return { message: 'Super! Votre déplacement de ligne de commande d\'achat a été effectué avec succès', status: 200 };
    }

    @Post('/items/:id')
    @Permissions('create-purchase-item')
    @ApiOperation({ summary: 'Create a new purchase item' })
    async createItem(@Param('id', ParseUUIDPipe) id: string, @Body() createPurchaseItemDto: CreatePurchaseItemDto) {
        await this.purchaseService.addItem(createPurchaseItemDto, id);
        return { message: 'Super! Votre ligne de commande d\'achat a été créée avec succès', status: 201 };
    }

    @Delete(':id')
    @Permissions('delete-purchase')
    @ApiOperation({ summary: 'Delete a purchase' })
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        await this.purchaseService.deletePurchase(id);
        return { message: 'Super! Votre commande d\'achat a été supprimée avec succès', status: 200 };
    }
}