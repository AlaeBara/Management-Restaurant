import { FundOperationService } from "../services/fund-operation.service";
import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FundOperationEntity } from "../entities/fund-operation.entity";
import { Permissions } from "src/user-management/decorators/auth.decorator";
import { CreateFundOperationDto } from "../dtos/fund-operation/create-fund-operation.dto";
import { CreateExpenseDto } from "../dtos/fund-operation/create-expense.dto";

@Controller('api/funds-operations')
@ApiTags('Fund Management - Operations')
@ApiBearerAuth()
export class FundOperationController {

    constructor(private readonly fundOperationService: FundOperationService) { }

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
    ): Promise<{ data: FundOperationEntity[]; total: number; page: number; limit: number }> {
        return this.fundOperationService.findAll(
            page,
            limit,
            relations,
            sort,
            withDeleted,
            onlyDeleted,
            select,
        );
    }

    @Post()
    @Permissions('create-fund-operation')
    @ApiOperation({ summary: 'Create a fund operation' })
    async create(@Body() createFundOperationDto: CreateFundOperationDto) {
        await this.fundOperationService.createOperation(createFundOperationDto);
        return { message: 'Your fund operation has been CREATED successfully', status: 201 };
    }

    @Post('expense')
    @Permissions('create-expense')
    @ApiOperation({ summary: 'Create a expense' })
    async createExpense(@Body() createExpenseDto: CreateExpenseDto) {
        await this.fundOperationService.createExpense(createExpenseDto);
        return { message: 'Your expense has been CREATED successfully', status: 201 };
    }

    @Patch(':id/approve')
    @Permissions('approve-fund-operation')
    @ApiOperation({ summary: 'Approve a fund operation' })
    async approveOperation(@Param('id') id: string) {
        await this.fundOperationService.approveOperation(id);
        return { message: 'Your operation has been APPROVED successfully', status: 200 };
    }
}
