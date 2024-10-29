import { Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, Put, Query } from "@nestjs/common";
import { ZoneService } from "../services/zone.services";
import { CreateZoneDto } from "../dtos/zone/create-zone.dto";
import { Body } from "@nestjs/common";
import { Permissions } from "src/user-management/decorators/auth.decorator";
import { Zone } from "../entities/zone.entity";
import { ApiTags } from "@nestjs/swagger";
import { UpdateZoneDto } from "../dtos/zone/update-zone.dto";
@Controller('api/zones')
@ApiTags('Zones')
export class ZoneController {
    constructor(private readonly zoneService: ZoneService){}

    @Get()
    @Permissions('view-zones')
    async findAll(
      @Query('page') page?: number,
      @Query('limit') limit?: number,
      @Query('relations') relations?: string[],
      @Query('sort') sort?: string,
    ): Promise<{ data: Zone[]; total: number; page: number; limit: number }> {
      return this.zoneService.findAll(page, limit, relations, sort);
    }

    @Get(':id')
    @Permissions('view-zone')
    async findOne(@Param('id',ParseUUIDPipe) id: string){
        return this.zoneService.findOrThrowByUUID(id);
    }

    @Post()
    @Permissions('create-zone')
    async create(@Body() zoneDto: CreateZoneDto){
        return this.zoneService.createZone(zoneDto);
    }

    @Put(':id')
    @Permissions('update-zone')
    async update(@Param('id',ParseUUIDPipe) id: string, @Body() zoneDto: UpdateZoneDto){
        return this.zoneService.updateByUUID(id, zoneDto);
    }

    @Delete(':id')
    @Permissions('delete-zone')
    async delete(@Param('id',ParseUUIDPipe) id: string){
        return this.zoneService.deleteByUUID(id);
    }

    @Patch(':id/restore')
    @Permissions('restore-zone')
    async restore(@Param('id',ParseUUIDPipe) id: string){
        return this.zoneService.restoreByUUID(id);
    }
}
