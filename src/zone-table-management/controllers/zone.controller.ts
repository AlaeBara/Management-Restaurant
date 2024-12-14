import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ZoneService } from '../services/zone.service';
import { CreateZoneDto } from '../dtos/zone/create-zone.dto';
import { Body } from '@nestjs/common';
import { Permissions, Public } from 'src/user-management/decorators/auth.decorator';
import { Zone } from '../entities/zone.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateZoneDto } from '../dtos/zone/update-zone.dto';
import { ReassignZoneDto } from '../dtos/zone/reassign-zone.dto';
import { TableService } from '../services/table.service';

@Controller('api/zones')
@ApiTags('Zones')
@ApiBearerAuth()
export class ZoneController {
  constructor(
    private readonly zoneService: ZoneService,
    private readonly tableService: TableService,
  ) { }

  /* private readonly PERMISSIONS = [
    { name: 'view-zones', label: 'Consulter toutes les zones', resource: 'zone' },
    { name: 'view-zone', label: 'Consulter une zone spécifique', resource: 'zone' },
    { name: 'create-zone', label: 'Ajouter une nouvelle zone', resource: 'zone' },
    { name: 'update-zone', label: 'Modifier une zone', resource: 'zone' },
    { name: 'delete-zone', label: 'Supprimer une zone', resource: 'zone' },
    { name: 'restore-zone', label: 'Récupérer une zone supprimée', resource: 'zone' },
    { name: 'reassign-zone', label: 'Réorganiser les zones', resource: 'zone' },
  ]; */

  @Get()
  @Permissions('view-zones')
  @ApiOperation({ summary: 'Get all zones' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('relations') relations?: string[],
    @Query('sort') sort?: string,
    @Query('withDeleted') withDeleted?: boolean,
    @Query('onlyDeleted') onlyDeleted?: boolean,
    @Query('select') select?: string[],
    @Query() query?: any,
  ): Promise<{ data: Zone[]; total: number; page: number; limit: number }> {
    return this.zoneService.findAll(
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

  @Get(':id')
  @Permissions('view-zone')
  @ApiOperation({ summary: 'Get a zone by id' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('relations') relations?: string[],
    @Query('withDeleted') withDeleted?: boolean,
  ) {
    return this.zoneService.findOrThrowByUUID(id, relations, withDeleted);
  }

  @Post()
  @Permissions('create-zone')
  @ApiOperation({ summary: 'Create a zone' })
  async create(@Body() zoneDto: CreateZoneDto) {
    await this.zoneService.createZone(zoneDto);
    return { message: 'Super! La zone a été créée avec succès', status: 201 };
  }

  @Put(':id')
  @Permissions('update-zone')
  @ApiOperation({ summary: 'Update a zone' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() zoneDto: UpdateZoneDto,
  ) {
    await this.zoneService.updateZoneByUUID(id, zoneDto);
    return { message: 'Super! La zone a été mise à jour avec succès', status: 200 };
  }

  @Delete(':id')
  @Permissions('delete-zone')
  @ApiOperation({ summary: 'Delete a zone' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.zoneService.deleteZoneByUUID(id);
    return { message: 'La zone a été supprimée avec succès', status: 200 };
  }

  @Patch(':id/restore')
  @Permissions('restore-zone')
  @ApiOperation({ summary: 'Restore a zone' })
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    await this.zoneService.restoreByUUID(id, true, ['zoneCode']);
    return { message: 'Super! La zone a été restaurée avec succès', status: 200 };
  }

  @Patch(':id/reassign')
  @Permissions('reassign-zone')
  @ApiOperation({ summary: 'Reassign a zone' })
  async reassign(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() reassignZoneDto: ReassignZoneDto,
  ) {
    await this.zoneService.reassignChildZones(id, reassignZoneDto.uuid);
    return { message: 'Super! La zone a été réassignée avec succès', status: 200 };
  }

  @Get(':id/tables')
  @Permissions('view-tables')
  @ApiOperation({ summary: 'Get all tables of a zone' })

  async findTables(@Param('id', ParseUUIDPipe) id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('relations') relations?: string[],
    @Query('sort') sort?: string,
    @Query('withDeleted') withDeleted?: boolean,
    @Query('onlyDeleted') onlyDeleted?: boolean,
    @Query('select') select?: string[],
    @Query() query?: any,
  ) {
    return this.tableService.findAll(page, limit, relations, sort, withDeleted, onlyDeleted, select, query, { zone: { id } });
  }
}
