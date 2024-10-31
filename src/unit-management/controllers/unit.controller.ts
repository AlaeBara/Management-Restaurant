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

  @Get()
  @Permissions('view-units')
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('relations') relations?: string[],
    @Query('sort') sort?: string,
    @Query('withDeleted') withDeleted?: boolean,
  ): Promise<{ data: Unit[]; total: number; page: number; limit: number }> {
    return this.unitService.findAll(page, limit, relations, sort, withDeleted);
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
    @Query('relations') relations?: string[],
    @Query('withDeleted') withDeleted?: boolean,
  ) {
    return this.unitService.findOrThrowByUUID(id, relations, withDeleted);
  }

  @Put(':id')
  @Permissions('update-unit')
  async updateUnits(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() unitdto: UpdateUnitDto,
  ) {
    return this.unitService.updateByUUID(id, unitdto);
  }

  @Delete(':id')
  @Permissions('delete-unit')
  async deleteUnits(@Param('id', ParseUUIDPipe) id: string) {
    const unit = await this.unitService.findOrThrowByUUID(id);
    return this.unitService.deleteByEntity(unit);
  }

  @Patch(':id/restore')
  @Permissions('restore-unit')
  async restoreUnits(@Param('id', ParseUUIDPipe) id: string) {
    await this.unitService.findOrThrowByUUID(id);
    return this.unitService.restoreByUUID(id);
  }
}
