import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { StorageService } from "../services/storage.service";
import { Permissions } from "src/user-management/decorators/auth.decorator";
import { Storage } from "../entities/storage.entity";
import { CreateStorageDto } from "../dtos/create-storage.dto";
import { UpdateStorageDto } from "../dtos/update-storage.dto";
import { ApiTags } from "@nestjs/swagger";
import { AssignParentStorageDto } from "../dtos/assign-parentStorage.dto";

@Controller('api/storages')
@ApiTags('Storages')
@ApiBearerAuth()
export class StorageController {

    constructor(private readonly storageService: StorageService) { }

    /* private readonly PERMISSIONS = [
      { name: 'view-storages', label: 'Voir tous les Location de stockage', resource: 'storage' },
      { name: 'view-storage', label: 'Voir une Location de stockage spécifique', resource: 'storage' }, 
      { name: 'create-storage', label: 'Créer une nouvelle Location de stockage', resource: 'storage' },
      { name: 'update-storage', label: 'Modifier une Location de stockage', resource: 'storage' },
      { name: 'delete-storage', label: 'Supprimer une Location de stockage', resource: 'storage' },
      { name: 'restore-storage', label: 'Restaurer une Location de stockage supprimée', resource: 'storage' }
    ]; */

    @Get()
    @Permissions('view-storages')
    @ApiOperation({ summary: 'Get all storages' })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('relations') relations?: string[],
        @Query('sort') sort?: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
    ): Promise<{ data: Storage[]; total: number; page: number; limit: number }> {
        return this.storageService.findAllWithHierarchy(
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
    @Permissions('view-storage')
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
    @Permissions('create-storage')
    @ApiOperation({ summary: 'Create a storage' })
    async create(@Body() createStorageDto: CreateStorageDto) {
        await this.storageService.createStorage(createStorageDto);
        return { message: 'Great! Your new storage location has been created successfully', status: 201 };
    }

    @Put(':id')
    @Permissions('update-storage')
    @ApiOperation({ summary: 'Update a storage' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateStorageDto: UpdateStorageDto,
    ) {
        await this.storageService.updateStorage(id, updateStorageDto);
        return { message: 'Great! Your storage location has been updated successfully', status: 200 };
    }

    @Delete(':id')
    @Permissions('delete-storage')
    @ApiOperation({ summary: 'Delete a storage' })
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        return await this.storageService.deleteStorage(id);
    }

    @Patch(':id/restore')
    @Permissions('restore-storage')
    @ApiOperation({ summary: 'Restore a storage' })
    async restore(@Param('id', ParseUUIDPipe) id: string) {
        await this.storageService.findOneByIdWithOptions(id, { onlyDeleted: true });
        return this.storageService.restoreByUUID(id, true, ['storageCode']);
    }

    @Patch(':id/assign-sub-storage')
    @Permissions('assign-sub-storage')
    @ApiOperation({ summary: 'Assign a sub-storage to a storage' })
    async assignParentStorage(@Param('id', ParseUUIDPipe) id: string, @Body() assignParentStorageDto: AssignParentStorageDto) {
        return this.storageService.assignParentStorage(id, assignParentStorageDto);
    }
}