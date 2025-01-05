import { Controller, Delete, Get, Inject, Param, ParseUUIDPipe, Patch, Query } from "@nestjs/common";
import { MediaLibraryService } from "../services/media-library.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { MediaLibrary } from "../entities/media-library.entity";
import { Permissions } from "src/user-management/decorators/auth.decorator";

@Controller('api/media-library')
@ApiTags('media-library')
@ApiBearerAuth()
export class MediaLibraryController {
    constructor(
        @Inject(MediaLibraryService)
        private readonly mediaLibraryService: MediaLibraryService
    ) {
    }

    @Get()
    @Permissions('view-media-library')
    @ApiOperation({ summary: 'Get all media libraries' })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('relations') relations?: string[],
        @Query('sort') sort?: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query() query?: any,
    ): Promise<{ data: MediaLibrary[]; total: number; page: number; limit: number }> {
        return this.mediaLibraryService.findAll(
            page,
            limit,
            relations,
            sort,
            withDeleted,
            onlyDeleted,
            select,
            query,
        );
    }

    @Get(':id')
    @Permissions('view-media-library')
    @ApiOperation({ summary: 'Get a media library by id' })
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('relations') relations?: string[],
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query('findOrThrow') findOrThrow?: boolean,
    ): Promise<MediaLibrary> {
        return this.mediaLibraryService.findOneWithoutBuilder(id, {
            relations,
            select,
            withDeleted,
            onlyDeleted,
            findOrThrow,
        });
    }

    /* @Delete(':id')
    @Permissions('delete-discount')
    @ApiOperation({ summary: 'Delete a discount' })
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        await this.mediaLibraryService.softDelete(id);
        return { message: 'Super! Votre média a été supprimé avec succès', status: 200 };
    }

    @Patch(':id/restore')
    @Permissions('restore-menu-item-tag')
    @ApiOperation({ summary: 'Restore a menu item tag' })
    async restore(@Param('id', ParseUUIDPipe) id: string) {
        await this.mediaLibraryService.restoreByUUID(id, true, ['discountSku']);
        return { message: 'Super! Votre média a été restauré avec succès', status: 200 };
    } */
}