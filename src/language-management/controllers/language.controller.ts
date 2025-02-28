import { Controller, Get, Inject, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { LanguageService } from "../services/langague.service";
import { Public } from "src/user-management/decorators/auth.decorator";
import { Language } from "../entities/language.entity";

@Controller('api/languages')
@ApiTags('language')
@ApiBearerAuth()
export class LanguageController {
    constructor(
        @Inject(LanguageService)
        private readonly languageService: LanguageService
    ) { }

    @Get()
    @Public()
    @ApiOperation({ summary: 'Get all languages' })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('relations') relations?: string[],
        @Query('sort') sort?: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query() query?: any,
    ): Promise<{ data: Language[]; total: number; page: number; limit: number }> {
        return this.languageService.findAll(
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
}