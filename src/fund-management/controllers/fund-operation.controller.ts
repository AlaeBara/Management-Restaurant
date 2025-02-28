import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { FundOperationService } from "../services/fund-operation.service";
import { FundOperationEntity } from "../entities/fund-operation.entity";
import { Permissions } from "src/user-management/decorators/auth.decorator";
import { CreateFundOperationDto } from "../dtos/fund-operation/create-fund-operation.dto";
import { CreateExpenseDto } from "../dtos/fund-operation/create-expense.dto";
import { CreateTransferOperationDto } from "../dtos/fund-operation/create-transfer-operation.dto";
import { ChangeFundSourceDto } from "../dtos/fund-operation/change-fund.dto";

@Controller('api/funds-operations')
@ApiTags('Fund Management - Operations')
@ApiBearerAuth()
export class FundOperationController {

    constructor(private readonly fundOperationService: FundOperationService) { }

    @Get()
    @Permissions('view-fund-operation')
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
    @Permissions('manage-fund-operation')
    @ApiOperation({ summary: 'Create a fund operation' })
    async create(@Body() createFundOperationDto: CreateFundOperationDto, @Req() req: Request) {
        await this.fundOperationService.createOperation(createFundOperationDto, req);
        return { message: 'Super! Votre opération de caisse a été créée avec succès', status: 201 };
    }

    @Post('expense')
    @Permissions('manage-expense')
    @ApiOperation({ summary: 'Create a expense' })
    async createExpense(@Body() createExpenseDto: CreateExpenseDto, @Req() req: Request) {
        await this.fundOperationService.createExpense(createExpenseDto, req);
        return { message: 'Super! Votre dépense a été créée avec succès', status: 201 };
    }

    @Patch(':id/approve')
    @Permissions('manage-fund-operation')
    @ApiOperation({ summary: 'Approve a fund operation' })
    async approveOperation(@Param('id') id: string, @Req() req: Request) {
        await this.fundOperationService.approveOperation(id, req);
        return { message: 'Super! Votre opération de caisse a été approuvée avec succès', status: 200 };
    }

    @Patch('transfer/:id/approve')
    @Permissions('manage-fund-operation')
    @ApiOperation({ summary: 'Approve a transfer fund operation' })
    async approveTransferOperation(@Param('id') id: string, @Req() req: Request) {
        await this.fundOperationService.approveTransferOperation(id, req);
        return { message: 'Super! Votre opération de transfert de caisse a été approuvée avec succès', status: 200 };
    }

    @Post('transfer/create')
    @Permissions('manage-fund-operation')
    @ApiOperation({ summary: 'Create a transfer fund operation' })
    async createTransferOperation(@Body() operationDto: CreateTransferOperationDto, @Req() req: Request) {
        await this.fundOperationService.trasfertOperation(operationDto, req);
        return { message: 'Super! Votre opération de transfert de caisse a été créée avec succès', status: 200 };
    }

    @Delete(':id')
    @Permissions('manage-fund-operation')
    @ApiOperation({ summary: 'Delete a fund operation' })
    async deleteOperation(@Param('id') id: string) {
        await this.fundOperationService.deleteOperation(id);
        return { message: 'Super! Votre opération de caisse a été supprimée avec succès', status: 200 };
    }

    @Patch('change-fund-source')
    @Permissions('manage-fund-operation')
    @ApiOperation({ summary: 'Change the fund source of a fund operation' })
    async changeFundSource(@Body() changeFundSourceDto: ChangeFundSourceDto) {
        await this.fundOperationService.changeFundSource(changeFundSourceDto);
        return { message: 'Super! Changement de la source de fonds effectué avec succès', status: 200 };
    }
}
