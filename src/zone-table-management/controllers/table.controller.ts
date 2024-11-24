import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Table } from '../entities/table.entity';
import { TableService } from '../services/table.service';
import {
  Permissions,
  Public,
} from 'src/user-management/decorators/auth.decorator';
import { CreateTableDto } from '../dtos/table/create-table.dto';
import { UpdateTableDto } from '../dtos/table/update-table.dto';

@Controller('api/tables')
@ApiTags('Tables')
@ApiBearerAuth()
export class TableController {
  constructor(private readonly tableService: TableService) { }

  /* private readonly PERMISSIONS = [
    { name: 'view-tables', label: 'Consulter toutes les tables', resource: 'table' },
    { name: 'view-table', label: 'Consulter une table spécifique', resource: 'table' },
    { name: 'create-table', label: 'Ajouter une nouvelle table', resource: 'table' },
    { name: 'update-table', label: 'Modifier une table', resource: 'table' },
    { name: 'delete-table', label: 'Supprimer une table', resource: 'table' },
    { name: 'restore-table', label: 'Récupérer une table supprimée', resource: 'table' }
  ]; */

  @Get()
  @Permissions('view-tables')
  @ApiOperation({ summary: 'Get all tables' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('relations') relations?: string[],
    @Query('sort') sort?: string,
    @Query('withDeleted') withDeleted?: boolean,
    @Query('onlyDeleted') onlyDeleted?: boolean,
    @Query('select') select?: string[],
  ): Promise<{ data: Table[]; total: number; page: number; limit: number }> {
    return this.tableService.findAll(
      page,
      limit,
      relations,
      sort,
      withDeleted,
      onlyDeleted,
      select,
    );
  }

  @Get('group-by-zone')
  @Permissions('view-tables')
  @ApiOperation({ summary: 'Get all tables grouped by zone' })
  async findAllGroupByZone() {
    return this.tableService.findAllGroupByZone();
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
  @Permissions('create-table')
  @ApiOperation({ summary: 'Create a table' })
  async create(@Body() createTableDto: CreateTableDto) {
    await this.tableService.createTable(createTableDto);
    return { message: 'Great! Your new table has been created successfully', status: 201 };
  }

  @Put(':id')
  @Permissions('update-table')
  @ApiOperation({ summary: 'Update a table' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTableDto: UpdateTableDto,
  ) {
    await this.tableService.updateTable(id, updateTableDto);
    return { message: 'Done! Your table has been updated successfully', status: 200 };
  }

  @Delete(':id')
  @Permissions('delete-table')
  @ApiOperation({ summary: 'Delete a table' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.tableService.findOrThrowByUUID(id);
    await this.tableService.softDelete(id);
    return { message: 'Table has been DELETED successfully', status: 200 };
  }

  @Patch(':id/restore')
  @Permissions('restore-table')
  @ApiOperation({ summary: 'Restore a table' })
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    await this.tableService.findOneByIdWithOptions(id, { onlyDeleted: true });
    await this.tableService.restoreByUUID(id, true, ['tableCode']);
    return { message: 'COOL! Table has been RESTORED successfully', status: 200 };
  }

  @Get('qrcode/:id')
  @Public()
  @ApiOperation({ summary: 'Generate a QR code for a table' })
  async generateQrCode(@Param('id') id: string) {
    const table = await this.tableService.findOne(id);
    return `<img src="${table.qrcode}" alt="QR Code" />`;
  }
}
