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
import { ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/user-management/decorators/auth.decorator';
import { Unit } from '../entities/unit.entity';
import { UpdateUnitDto } from '../dto/update-unit.dto';
import { CreateUnitDto } from '../dto/create-unit.dto';

@Controller('api/units')
@ApiTags('Units')
export class UnitController {
  constructor(private unitService: UnitService) {}

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
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('relations') relations?: string[],
    @Query('sort') sort?: string,
    @Query('withDeleted') withDeleted?: boolean,
    @Query('onlyDeleted') onlyDeleted?: boolean,
    @Query('select') select?: string[],
  ): Promise<{ data: Unit[]; total: number; page: number; limit: number }> {
    return this.unitService.findAll(
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
  @Permissions('create-unit')
  async createUnits(@Body() createUnitDto: CreateUnitDto) {
    return await this.unitService.create(createUnitDto);
  }

  @Get(':id')
  @Permissions('view-unit')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('withDeleted') withDeleted?: boolean,
    @Query('findOrThrow') findOrThrow?: boolean,
    @Query('onlyDeleted') onlyDeleted?: boolean,
    @Query('select') select?: string[],

  ) {
    return this.unitService.findOneByIdWithOptions(id,{select,withDeleted,onlyDeleted,findOrThrow:true});
  }

  @Put(':id')
  @Permissions('update-unit')
  async updateUnits(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() unitdto: UpdateUnitDto,
  ) {
    return this.unitService.update(id, unitdto);
  }

  @Delete(':id')
  @Permissions('delete-unit')
  async deleteUnits(@Param('id', ParseUUIDPipe) id: string) {
    await this.unitService.findOneByIdWithOptions(id,{findOrThrow:true});
    return this.unitService.softDelete(id);
  }

  @Patch(':id/restore')
  @Permissions('restore-unit')
  async restoreUnits(@Param('id', ParseUUIDPipe) id: string) {
    return this.unitService.restoreByUUID(id);
  }
}
