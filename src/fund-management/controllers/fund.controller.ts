import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FundService } from "../services/fund.service";
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query } from "@nestjs/common";
import { Permissions } from "src/user-management/decorators/auth.decorator";
import { Fund } from "../entities/fund.entity";
import { CreateFundDto } from "../dtos/fund/create-fund.dto";
import { UpdateFundDto } from "../dtos/fund/update-fund.dto";
@Controller('api/funds')
@ApiTags('Fund Management - Funds')
@ApiBearerAuth()
export class FundController {

    constructor(private readonly fundService: FundService) { }

    @Get()
    @Permissions('view-funds')
    @ApiOperation({ summary: 'Get all funds' })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('relations') relations?: string[],
        @Query('sort') sort?: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
    ): Promise<{ data: Fund[]; total: number; page: number; limit: number }> {
        return this.fundService.findAll(
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
    @Permissions('view-fund')
    @ApiOperation({ summary: 'Get a fund by id' })
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('relations') relations?: string[],
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query('findOrThrow') findOrThrow?: boolean,
    ): Promise<Fund> {
        return this.fundService.findOneByIdWithOptions(id, {
            relations,
            select,
            withDeleted,
            onlyDeleted,
            findOrThrow,
        });
    }

    @Post()
    @Permissions('create-fund')
    @ApiOperation({ summary: 'Create a fund' })
    async create(@Body() createFundDto: CreateFundDto) {
        await this.fundService.createFund(createFundDto);
        return {message: 'Your fund has been CREATED successfully', status: 201};
    }

    @Put(':id')
    @Permissions('update-fund')
    @ApiOperation({ summary: 'Update a fund' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateFundDto: UpdateFundDto,
    ) {
        await this.fundService.updateFund(id, updateFundDto);
        return { message: 'Great! Your fund has been UPDATED successfully', status: 200 };
    }

    @Delete(':id')
    @Permissions('delete-fund')
    @ApiOperation({ summary: 'Delete a fund' })
    async delete(@Param('id', ParseUUIDPipe) id: string) {
         await this.fundService.deleteFund(id);
         return {message: 'Your fund has been DELETED successfully', status: 200};
    }

    @Patch(':id/restore')
    @Permissions('restore-fund')
    @ApiOperation({ summary: 'Restore a fund' })
    async restore(@Param('id', ParseUUIDPipe) id: string) {
        await this.fundService.findOneByIdWithOptions(id, { onlyDeleted: true });
        await this.fundService.restoreByUUID(id, true, ['sku']);
        return {message: 'Your fund has been RESTORED successfully', status: 200};
    }
}