import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { PurchaseService } from "../services/purchase.service";
import { Permissions } from "src/user-management/decorators/auth.decorator";
import { CreatePurchaseDto } from "../dtos/create-purchase.dto";
import { ExecutePurchaseMovementDto } from "../dtos/execute-purchase-movement.dto";

@Controller('api/purchases')
@ApiTags('Purchase Management - Purchases')
@ApiBearerAuth()
export class PurchaseController {
    constructor(private readonly purchaseService: PurchaseService) { }

    @Post()
    @Permissions('create-purchase')
    @ApiOperation({ summary: 'Create a new purchase' })
    async create(@Body() createPurchaseDto: CreatePurchaseDto, @Req() request: Request) {
        await this.purchaseService.createPurchase(createPurchaseDto, request);
        return { message: 'Commande d\'achat créée avec succès', status: 201 };
    }

    @Delete('/items/:id')
    @Permissions('delete-purchase-item')
    @ApiOperation({ summary: 'Delete a purchase item' })
    async deleteItem(@Param('id', ParseUUIDPipe) id: string) {
        await this.purchaseService.deleteItem(id);
        return { message: 'Ligne de commande d\'achat supprimée avec succès', status: 200 };
    }

    @Post('/items/:id/execute-movement')
    @Permissions('execute-purchase-movement')
    @ApiOperation({ summary: 'Execute a purchase movement' })
    async executeMovement(@Param('id', ParseUUIDPipe) id: string, @Body() executePurchaseMovementDto: ExecutePurchaseMovementDto, @Req() request: Request) {
        await this.purchaseService.executePurchaseMovement(executePurchaseMovementDto, request);
        return { message: 'Déplacement de la ligne de commande d\'achat effectué avec succès', status: 200 };
    }

}