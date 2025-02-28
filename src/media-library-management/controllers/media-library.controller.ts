import { Controller, Get, Inject, Param, ParseUUIDPipe, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { MediaLibraryService } from "../services/media-library.service";
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
    @Permissions('view-user')
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
    @Permissions('view-user')
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
}