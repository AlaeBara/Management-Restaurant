import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { ApiTags } from "@nestjs/swagger";

import { StorageService } from "../services/storage.service";
import { Permissions } from "src/user-management/decorators/auth.decorator";
import { Storage } from "../entities/storage.entity";
import { CreateStorageDto } from "../dtos/create-storage.dto";
import { UpdateStorageDto } from "../dtos/update-storage.dto";
import { AssignParentStorageDto } from "../dtos/assign-parentStorage.dto";

@Controller('api/storages')
@ApiTags('Storages')
@ApiBearerAuth()
export class StorageController {

    constructor(private readonly storageService: StorageService) { }

    @Get()
    @Permissions('view-location-storage')
    @ApiOperation({ summary: 'Get all storages' })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('relations') relations?: string[],
        @Query('sort') sort?: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query() query?: any,
    ): Promise<{ data: Storage[]; total: number; page: number; limit: number }> {
        return this.storageService.findAllWithHierarchy(
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
    @Permissions('view-location-storage')
    @ApiOperation({ summary: 'Get a storage by id' })
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('relations') relations?: string[],
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query('findOrThrow') findOrThrow?: boolean,
    ) {
        return this.storageService.getStorageWithHierarchy(id, {
            relations,
            select,
            withDeleted,
            onlyDeleted,
            findOrThrow,
        }); 
    }

    @Post()
    @Permissions('manage-location-storage')
    @ApiOperation({ summary: 'Create a storage' })
    async create(@Body() createStorageDto: CreateStorageDto) {
        await this.storageService.createStorage(createStorageDto);
        return { message: 'Super! Votre nouvelle localisation de stockage a été créée avec succès', status: 201 };
    }

    @Put(':id')
    @Permissions('manage-location-storage')
    @ApiOperation({ summary: 'Update a storage' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateStorageDto: UpdateStorageDto,
    ) {
        await this.storageService.updateStorage(id, updateStorageDto);
        return { message: 'Super! Votre localisation de stockage a été mise à jour avec succès', status: 200 };
    }

    @Delete(':id')
    @Permissions('manage-location-storage')
    @ApiOperation({ summary: 'Delete a storage' })
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        await this.storageService.deleteStorage(id);
        return { message: 'Super! Votre localisation de stockage a été supprimée avec succès', status: 200 };
    }

    @Patch(':id/restore')
    @Permissions('manage-location-storage')
    @ApiOperation({ summary: 'Restore a storage' })
    async restore(@Param('id', ParseUUIDPipe) id: string) {
        await this.storageService.findOneByIdWithOptions(id, { onlyDeleted: true });
        await this.storageService.restoreByUUID(id, true, ['storageCode']);
        return { message: 'Super! Votre localisation de stockage a été restaurée avec succès', status: 200 };
    }

    @Patch(':id/assign-sub-storage')
    @Permissions('manage-location-storage')
    @ApiOperation({ summary: 'Assign a sub-storage to a storage' })
    async assignParentStorage(@Param('id', ParseUUIDPipe) id: string, @Body() assignParentStorageDto: AssignParentStorageDto) {
        await this.storageService.assignParentStorage(id, assignParentStorageDto);
        return { message: 'Super! Votre localisation de stockage a été assignée avec succès', status: 200 };
    }
}