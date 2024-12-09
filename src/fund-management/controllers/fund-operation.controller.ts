import { FundOperationService } from "../services/fund-operation.service";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FundOperationEntity } from "../entities/fund-operation.entity";
import { Permissions } from "src/user-management/decorators/auth.decorator";
import { CreateFundOperationDto } from "../dtos/fund-operation/create-fund-operation.dto";
import { CreateExpenseDto } from "../dtos/fund-operation/create-expense.dto";
import { CreateTransferOperationDto } from "../dtos/fund-operation/create-transfer-operation.dto";

@Controller('api/funds-operations')
@ApiTags('Fund Management - Operations')
@ApiBearerAuth()
export class FundOperationController {

    constructor(private readonly fundOperationService: FundOperationService) { }

    /**
     * Permissions for this controlleق
    private fundOperationPermissions = [
        { name: 'view-funds-operations', label: 'Voir toutes les op rations des caisses', resource: 'operation' },
        { name: 'create-fund-operation', label: 'Cr er une nouvelle op ration de caisse', resource: 'operation' },
        { name: 'create-expense', label: 'Cr er une nouvelle d pense', resource: 'operation' },
        { name: 'approve-fund-operation', label: 'Approuver une op ration de caisse', resource: 'operation' },
        { name: 'approve-transfer-fund-operation', label: 'Approuver operation de transfert de fonds', resource: 'operation' },
        { name: 'create-transfer-fund-operation', label: 'Créer une opération de transfert de fonds', resource: 'operation' },
    ];*/


    @Get()
    @Permissions('view-funds-operations')
    @ApiOperation({ summary: 'Get all funds operations' })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('relations') relations?: string[],
        @Query('sort') sort?: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query() query?: any,
    ): Promise<{ data: FundOperationEntity[]; total: number; page: number; limit: number }> {
        return this.fundOperationService.findAll(
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
    @Permissions('create-fund-operation')
    @ApiOperation({ summary: 'Create a fund operation' })
    async create(@Body() createFundOperationDto: CreateFundOperationDto, @Req() req: Request) {
        await this.fundOperationService.createOperation(createFundOperationDto, req);
        return { message: 'Your fund operation has been CREATED successfully', status: 201 };
    }

    @Post('expense')
    @Permissions('create-expense')
    @ApiOperation({ summary: 'Create a expense' })
    async createExpense(@Body() createExpenseDto: CreateExpenseDto, @Req() req: Request) {
        await this.fundOperationService.createExpense(createExpenseDto, req);
        return { message: 'Your expense has been CREATED successfully', status: 201 };
    }

    @Patch(':id/approve')
    @Permissions('approve-fund-operation')
    @ApiOperation({ summary: 'Approve a fund operation' })
    async approveOperation(@Param('id') id: string, @Req() req: Request) {
        await this.fundOperationService.approveOperation(id, req);
        return { message: 'Your operation has been APPROVED successfully', status: 200 };
    }

    @Patch('transfer/:id/approve')
    @Permissions('approve-transfer-fund-operation')
    @ApiOperation({ summary: 'Approve a transfer fund operation' })
    async approveTransferOperation(@Param('id') id: string, @Req() req: Request) {
        await this.fundOperationService.approveTransferOperation(id, req);
        return { message: 'Your transfer operation has been APPROVED successfully', status: 200 };
    }

    @Post('transfer/create')
    @Permissions('create-transfer-fund-operation')
    @ApiOperation({ summary: 'Create a transfer fund operation' })
    async createTransferOperation(@Body() operationDto: CreateTransferOperationDto, @Req() req: Request) {
        await this.fundOperationService.trasfertOperation(operationDto, req);
        return { message: 'Your transfer operation has been CREATED successfully', status: 200 };
    }

    @Delete(':id')
    @Permissions('delete-fund-operation')
    @ApiOperation({ summary: 'Delete a fund operation' })
    async deleteOperation(@Param('id') id: string) {
        await this.fundOperationService.deleteOperation(id);
        return { message: 'Your operation has been DELETED successfully', status: 200 };
    }
}
