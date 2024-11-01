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
import { Permissions } from 'src/user-management/decorators/auth.decorator';
import { Zone } from '../entities/zone.entity';
import { ApiTags } from '@nestjs/swagger';
import { UpdateZoneDto } from '../dtos/zone/update-zone.dto';
import { ReassignZoneDto } from '../dtos/zone/reassign-zone.dto';

@Controller('api/zones')
@ApiTags('Zones')
export class ZoneController {
  constructor(private readonly zoneService: ZoneService) {}

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
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('relations') relations?: string[],
    @Query('withDeleted') withDeleted?: boolean,
  ) {
    return this.zoneService.findOrThrowByUUID(id, relations, withDeleted);
  }

  @Post()
  @Permissions('create-zone')
  async create(@Body() zoneDto: CreateZoneDto) {
    return this.zoneService.createZone(zoneDto);
  }

  @Put(':id')
  @Permissions('update-zone')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() zoneDto: UpdateZoneDto,
  ) {
    return this.zoneService.updateZoneByUUID(id, zoneDto);
  }

  @Delete(':id')
  @Permissions('delete-zone')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.zoneService.deleteZoneByUUID(id);
  }

  @Patch(':id/restore')
  @Permissions('restore-zone')
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.zoneService.restoreByUUID(id, true, ['zoneCode']);
  }

  @Patch(':id/reassign')
  @Permissions('reassign-zone')
  async reassign(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() reassignZoneDto: ReassignZoneDto,
  ) {
    return this.zoneService.reassignChildZones(id, reassignZoneDto.uuid);
  }
}
