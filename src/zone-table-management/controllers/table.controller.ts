import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Table } from '../entities/table.entity';
import { TableService } from '../services/table.service';
import { Permissions, Public } from 'src/user-management/decorators/auth.decorator';
import { CreateTableDto } from '../dtos/table/create-table.dto';
import { UpdateTableDto } from '../dtos/table/update-table.dto';
import { CreateManyTablesDto } from '../dtos/table/create-many-tables.dto';

@Controller('api/tables')
@ApiTags('Tables')
@ApiBearerAuth()
export class TableController {
  constructor(private readonly tableService: TableService) { }

  @Get()
  @Permissions('view-table')
  @ApiOperation({ summary: 'Get all tables' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('relations') relations?: string[],
    @Query('sort') sort?: string,
    @Query('withDeleted') withDeleted?: boolean,
    @Query('onlyDeleted') onlyDeleted?: boolean,
    @Query('select') select?: string[],
    @Query() query?: any,
  ): Promise<{ data: Table[]; total: number; page: number; limit: number }> {
    return this.tableService.findAll(
      page,
      limit,
      relations,
      sort,
      withDeleted,
      onlyDeleted,
      select,
      query
    );
  }

  @Get('group-by-zone')
  @Permissions('view-table')
  @ApiOperation({ summary: 'Get all tables grouped by zone' })
  async findAllGroupByZone() {
    return this.tableService.findAllGroupByZone();
  }

  @Get('find/:idOrTableCode')
  @Permissions('view-table')
  @ApiOperation({ summary: 'Get a table by id or table code' })
  async getTableByIdOrTableCode(@Param('idOrTableCode') idOrTableCode: string) {
    return this.tableService.getTableByIdOrTableCode(idOrTableCode);
  }

  @Get(':id')
  @Permissions('view-table')
  @ApiOperation({ summary: 'Get a table by id' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('withDeleted') withDeleted?: boolean,
    @Query('relations') relations?: string[],
    @Query('onlyDeleted') onlyDeleted?: boolean,
    @Query('select') select?: string[],
    @Query('findOrThrow') findOrThrow?: boolean,
  ) {
    return this.tableService.findOneByIdWithOptions(id, {
      relations,
      select,
      withDeleted,
      onlyDeleted,
      findOrThrow,
    });
  }

  @Post()
  @Permissions('manage-table')
  @ApiOperation({ summary: 'Create a table' })
  async create(@Body() createTableDto: CreateTableDto) {
    await this.tableService.createTable(createTableDto);
    return { message: 'Super! Votre nouvelle table a été créée avec succès', status: 201 };
  }

  @Put(':id')
  @Permissions('manage-table')
  @ApiOperation({ summary: 'Update a table' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTableDto: UpdateTableDto,
  ) {
    await this.tableService.updateTable(id, updateTableDto);
    return { message: 'Super! Votre table a été mise à jour avec succès', status: 200 };
  }

  @Delete(':id')
  @Permissions('manage-table')
  @ApiOperation({ summary: 'Delete a table' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.tableService.findOrThrowByUUID(id);
    await this.tableService.softDelete(id);
    return { message: 'La table a été supprimée avec succès', status: 200 };
  }

  @Patch(':id/restore')
  @Permissions('manage-table')
  @ApiOperation({ summary: 'Restore a table' })
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    await this.tableService.findOneByIdWithOptions(id, { onlyDeleted: true });
    await this.tableService.restoreByUUID(id, true, ['tableCode']);
    return { message: 'Super! La table a été restaurée avec succès', status: 200 };
  }

  @Get('qrcode/:id')
  @Public()
  @ApiOperation({ summary: 'Generate a QR code for a table' })
  async generateQrCode(@Param('id') id: string) {
    const table = await this.tableService.findOne(id);
    return `<img src="${table.qrcode}" alt="QR Code" />`;
  }

  @Post('generate-tables')
  @Permissions('manage-table')
  @ApiOperation({ summary: 'Create multiple tables' })
  async generateTables(@Body() createTablesDto: CreateManyTablesDto) {
    await this.tableService.createManyTables(createTablesDto);
    return { message: 'Super! Chaque table a été créée avec succès', status: 201 };
  }
}
