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
  ): Promise<{ data: Zone[]; total: number; page: number; limit: number }> {
    return this.zoneService.findAll(
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
    return this.zoneService.createZone(zoneDto);
  }

  @Put(':id')
  @Permissions('update-zone')
  @ApiOperation({ summary: 'Update a zone' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() zoneDto: UpdateZoneDto,
  ) {
    return this.zoneService.updateZoneByUUID(id, zoneDto);
  }

  @Delete(':id')
  @Permissions('delete-zone')
  @ApiOperation({ summary: 'Delete a zone' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.zoneService.deleteZoneByUUID(id);
  }

  @Patch(':id/restore')
  @Permissions('restore-zone')
  @ApiOperation({ summary: 'Restore a zone' })
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.zoneService.restoreByUUID(id, true, ['zoneCode']);
  }

  @Patch(':id/reassign')
  @Permissions('reassign-zone')
  @ApiOperation({ summary: 'Reassign a zone' })
  async reassign(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() reassignZoneDto: ReassignZoneDto,
  ) {
    return this.zoneService.reassignChildZones(id, reassignZoneDto.uuid);
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
  ) {
    return this.tableService.findAll(page, limit, relations, sort, withDeleted, onlyDeleted, select, { zone: { id } });
  }
}
