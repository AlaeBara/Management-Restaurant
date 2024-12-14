import { UnitService } from '../services/unit.service';
import {
  Controller,
  Post,
  Get,
  Query,
  ParseUUIDPipe,
  Put,
  Param,
  Body,
  Delete,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/user-management/decorators/auth.decorator';
import { Unit } from '../entities/unit.entity';
import { UpdateUnitDto } from '../dto/update-unit.dto';
import { CreateUnitDto } from '../dto/create-unit.dto';

@Controller('api/units')
@ApiTags('Units')
@ApiBearerAuth()
export class UnitController {
  constructor(private unitService: UnitService) { }

  /* private unitPermissions = [
    { name: 'view-units', label: 'Voir toutes les unités', resource: 'unit' },
    { name: 'create-unit', label: 'Créer une nouvelle unité', resource: 'unit' },
    { name: 'view-unit', label: 'Voir une unité spécifique', resource: 'unit' },
    { name: 'update-unit', label: 'Mettre à jour une unité existante', resource: 'unit' },
    { name: 'delete-unit', label: 'Supprimer une unité', resource: 'unit' },
    { name: 'restore-unit', label: 'Restaurer une unité supprimée', resource: 'unit' }
  ]; */

  @Get()
  @Permissions('view-units')
  @ApiOperation({ summary: 'Get all units' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('relations') relations?: string[],
    @Query('sort') sort?: string,
    @Query('withDeleted') withDeleted?: boolean,
    @Query('onlyDeleted') onlyDeleted?: boolean,
    @Query('select') select?: string[],
    @Query() query?: any,
  ): Promise<{ data: Unit[]; total: number; page: number; limit: number }> {
    return this.unitService.findAll(
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

  @Post()
  @Permissions('create-unit')
  @ApiOperation({ summary: 'Create a unit' })
  async createUnits(@Body() createUnitDto: CreateUnitDto) {
    await this.unitService.createUnit(createUnitDto);
    return { message: 'Super! L\'unité a été créée avec succès', status: 200 };
  }

  @Get(':id')
  @Permissions('view-unit')
  @ApiOperation({ summary: 'Get a unit by id' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('withDeleted') withDeleted?: boolean,
    @Query('findOrThrow') findOrThrow?: boolean,
    @Query('onlyDeleted') onlyDeleted?: boolean,
    @Query('select') select?: string[],

  ) {
    return this.unitService.findOneByIdWithOptions(id, { select, withDeleted, onlyDeleted, findOrThrow: true });
  }

  @Put(':id')
  @Permissions('update-unit')
  @ApiOperation({ summary: 'Update a unit' })
  async updateUnits(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() unitdto: UpdateUnitDto,
  ) {
    await this.unitService.updateUnit(id, unitdto);
    return { message: 'Super! L\'unité a été mise à jour avec succès', status: 200 };
  }

  @Delete(':id')
  @Permissions('delete-unit')
  @ApiOperation({ summary: 'Delete a unit' })
  async deleteUnits(@Param('id', ParseUUIDPipe) id: string) {
    await this.unitService.findOneByIdWithOptions(id, { findOrThrow: true });
    await this.unitService.softDelete(id);
    return { message: 'La table a été supprimée avec succès', status: 200 };
  }

  @Patch(':id/restore')
  @Permissions('restore-unit')
  @ApiOperation({ summary: 'Restore a unit' })
  async restoreUnits(@Param('id', ParseUUIDPipe) id: string) {
    await this.unitService.restoreByUUID(id, true);
    return { message: 'Super! L\'unité a été restaurée avec succès', status: 200 };
  }
}
