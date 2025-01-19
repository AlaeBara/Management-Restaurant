import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query } from "@nestjs/common";
import { Permissions } from "src/user-management/decorators/auth.decorator";
import { UpdateFundDto } from "../dtos/fund/update-fund.dto";
import { ExpenseTypeService } from "../services/expense-type.service";
import { ExpenseType } from "../entities/expense-type.entity";
import { CreateExpenseTypeDto } from "../dtos/expense-type/create-expense-type.dto";
import { UpdateExpenseTypeDto } from "../dtos/expense-type/update-expense-type.dto";

@Controller('api/expense-types')
@ApiTags('Fund Management - Expense Types')
@ApiBearerAuth()
export class ExpenseTypeController {

    constructor(private readonly expenseTypeService: ExpenseTypeService) { }

    /* private fundPermissions =  [
        { name: 'view-expense-types', label: 'View all expense types', resource: 'expense type' },
        { name: 'view-expense-type', label: 'View single expense type', resource: 'expense type' },
        { name: 'create-expense-type', label: 'Create new expense type', resource: 'expense type' },    
        { name: 'update-expense-type', label: 'Update expense type', resource: 'expense type' },
        { name: 'delete-expense-type', label: 'Delete expense type', resource: 'expense type' },
        { name: 'restore-expense-type', label: 'Restore deleted expense type', resource: 'expense type' },
        { name: 'view-expense-type-operations', label: 'View expense type operations', resource: 'expense type' }
    ]; */

    @Get()
    @Permissions('view-expense-types')
    @ApiOperation({ summary: 'Get all expense types' })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('relations') relations?: string[],
        @Query('sort') sort?: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query() query?: any,
    ): Promise<{ data: ExpenseType[]; total: number; page: number; limit: number }> {
        return this.expenseTypeService.findAll(
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
    @Permissions('view-expense-type')
    @ApiOperation({ summary: 'Get a expense type by id' })
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('relations') relations?: string[],
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query('findOrThrow') findOrThrow?: boolean,
    ): Promise<ExpenseType> {
        return this.expenseTypeService.findOneByIdWithOptions(id, {
            relations,
            select,
            withDeleted,
            onlyDeleted,
            findOrThrow,
        });
    }

    @Post()
    @Permissions('create-expense-type')
    @ApiOperation({ summary: 'Create a expense type' })
    async create(@Body() createExpenseTypeDto: CreateExpenseTypeDto) {
        const expenseType = await this.expenseTypeService.createExpenseType(createExpenseTypeDto);
        return {
            message: 'Super! Votre type de dépense a été créée avec succès',
            id: expenseType.id, 
            status: 201
        };
    }

    @Put(':id')
    @Permissions('update-fund')
    @ApiOperation({ summary: 'Update a fund' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateFundDto: UpdateExpenseTypeDto,
    ) {
        await this.expenseTypeService.updateExpenseType(id, updateFundDto);
        return { message: 'Super! Votre type de dépense a été modifiée avec succès', status: 200 };
    }

    @Delete(':id')
    @Permissions('delete-expense-type')
    @ApiOperation({ summary: 'Delete a expense type' })
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        await this.expenseTypeService.deleteExpenseType(id);
        return { message: 'Super! Votre type de dépense a été supprimée avec succès', status: 200 };
    }

    @Patch(':id/restore')
    @Permissions('restore-expense-type')
    @ApiOperation({ summary: 'Restore a expense type' })
    async restore(@Param('id', ParseUUIDPipe) id: string) {
        await this.expenseTypeService.findOneByIdWithOptions(id, { onlyDeleted: true });
        await this.expenseTypeService.restoreByUUID(id, true, ['name']);
        return { message: 'Super! Votre type de dépense a été restaurée avec succès', status: 200 };
    }
}