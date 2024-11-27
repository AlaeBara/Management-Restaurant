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

    /* PERMISSIONS = [
        { name: 'view-categories', label: 'Voir toutes les catégories', resource: 'category' },
        { name: 'view-category', label: 'Voir une catégorie spécifique', resource: 'category' },
        { name: 'create-category', label: 'Créer une nouvelle catégorie', resource: 'category' },
        { name: 'update-category', label: 'Modifier une catégorie', resource: 'category' },
        { name: 'delete-category', label: 'Supprimer une catégorie', resource: 'category' },
        { name: 'restore-category', label: 'Restaurer une catégorie supprimée', resource: 'category' }
    ]; */
    
    @Get()
    @Permissions('view-categories')
    @ApiOperation({ summary: 'Get all Categories' })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('relations') relations?: string[],
        @Query('sort') sort?: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
    ): Promise<{ data: Category[]; total: number; page: number; limit: number }> {
        return this.categoryService.findAll(
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
    @Permissions('create-category')
    @ApiOperation({ summary: 'Create a category' })
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        await this.categoryService.createCategory(createCategoryDto);
        return { message: 'Great! Category has been CREATED successfully', status: 201 };
    }

    @Put(':id')
    @Permissions('update-category')
    @ApiOperation({ summary: 'Update a category' })
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        await this.categoryService.updateCategory(id, updateCategoryDto);
        return { message: 'Cool! Category has been UPDATED successfully', status: 200 };
    }

    @Delete(':id')
    @Permissions('delete-category')
    @ApiOperation({ summary: 'Delete a category' })
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        await this.categoryService.deleteCategory(id);
        return { message: 'Category has been DELETED successfully', status: 200 };
    }
    @Patch(':id/restore')
    @Permissions('restore-category')
    @ApiOperation({ summary: 'Restore a category' })
    async restore(@Param('id', ParseUUIDPipe) id: string) {
        await this.categoryService.restoreByUUID(id, true, ['categoryCode']);
        return { message: 'Category has been RESTORED successfully', status: 200 };
    }

}
