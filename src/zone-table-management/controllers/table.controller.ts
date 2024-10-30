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
import { ApiTags } from '@nestjs/swagger';
import { Table } from '../entities/table.entity';
import { TableService } from '../services/table.services';
import { Permissions, Public } from 'src/user-management/decorators/auth.decorator';
import { CreateTableDto } from '../dtos/table/create-table.dto';
import { UpdateTableDto } from '../dtos/table/update-table.dto';

@Controller('api/tables')
@ApiTags('Tables')
export class TableController {
  constructor(private readonly tableService: TableService) {}


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
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('relations') relations?: string[],
    @Query('sort') sort?: string,
    @Query('withDeleted') withDeleted?: boolean,
  ): Promise<{ data: Table[]; total: number; page: number; limit: number }> {
    return this.tableService.findAll(page, limit, relations, sort, withDeleted);
  }

  @Get(':id')
  @Permissions('view-table')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('withDeleted') withDeleted?: boolean,
    @Query('relations') relations?: string[],
  ) {
    return this.tableService.getTableByUUID(id, relations, withDeleted);
  }

  @Post()
  @Permissions('create-table')
  async create(@Body() createTableDto: CreateTableDto) {
    return this.tableService.createTable(createTableDto);
  }

  @Put(':id')
  @Permissions('update-table')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTableDto: UpdateTableDto,
  ) {
    return this.tableService.updateTable(id, updateTableDto);
  }

  @Delete(':id')
  @Permissions('delete-table')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.tableService.deleteByUUID(id);
  }

  @Patch(':id/restore')
  @Permissions('restore-table')
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.tableService.restoreByUUID(id, true, ['tableCode']);
  }

  @Get('qrcode/:id')
  @Public()
  async generateQrCode(@Param('id') id: string) {
    const table = await this.tableService.findOneByUUID(id);
    return `<img src="${table.qrcode}" alt="QR Code" />`;
  }
}
