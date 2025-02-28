import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { CategoryService } from "../services/category.service";
import { Permissions } from "src/user-management/decorators/auth.decorator";
import { Category } from "../entities/category.entity";
import { CreateCategoryDto } from "../dtos/category/create-category.dto";
import { UpdateCategoryDto } from "../dtos/category/update-category.dto";

@Controller('api/categories')
@ApiTags('Product Management - Categories')
@ApiBearerAuth()
export class CategoryController {

    constructor(private readonly categoryService: CategoryService) { }

    @Get()
    @Permissions('view-category')
    @ApiOperation({ summary: 'Get all Categories' })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('relations') relations?: string[],
        @Query('sort') sort?: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query() query?: any,
    ): Promise<{ data: Category[]; total: number; page: number; limit: number }> {
        return this.categoryService.findAll(
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
    @Permissions('view-category')
    @ApiOperation({ summary: 'Get a category by id' })
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('relations') relations?: string[],
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
        @Query('findOrThrow') findOrThrow?: boolean,
    ) {
        return this.categoryService.findOneByIdWithOptions(id, {
            relations,
            select,
            withDeleted,
            onlyDeleted,
            findOrThrow,
        });
    }

    @Post()
    @Permissions('manage-category')
    @ApiOperation({ summary: 'Create a category' })
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        await this.categoryService.createCategory(createCategoryDto);
        return { message: 'Super! Votre catégorie a été créée avec succès', status: 201 };
    }

    @Put(':id')
    @Permissions('manage-category')
    @ApiOperation({ summary: 'Update a category' })
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        await this.categoryService.updateCategory(id, updateCategoryDto);
        return { message: 'Super! Votre catégorie a été modifiée avec succès', status: 200 };
    }

    @Delete(':id')
    @Permissions('manage-category')
    @ApiOperation({ summary: 'Delete a category' })
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        await this.categoryService.deleteCategory(id);
        return { message: 'Super! Votre catégorie a été supprimée avec succès', status: 200 };
    }
    @Patch(':id/restore')
    @Permissions('manage-category')
    @ApiOperation({ summary: 'Restore a category' })
    async restore(@Param('id', ParseUUIDPipe) id: string) {
        await this.categoryService.restoreByUUID(id, true, ['categoryCode']);
        return { message: 'Super! Votre catégorie a été restaurée avec succès', status: 200 };
    }

}
