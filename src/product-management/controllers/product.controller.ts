import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ProductService } from "../services/product.service";
import { Permissions } from "src/user-management/decorators/auth.decorator";
import { Product } from "../entities/product.entity";
import { CreateProductDto } from "../dtos/product/create-product.dto";
import { UpdateProductDto } from "../dtos/product/update-product.dto";
import { plainToInstance } from "class-transformer";

@Controller('api/products')
@ApiTags('Product Management - Products')
@ApiBearerAuth()
export class ProductController {

    constructor(private readonly productService: ProductService) { }

    @Get()
    @Permissions('view-products')
    @ApiOperation({ summary: 'Get all Products' })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('relations') relations?: string[],
        @Query('sort') sort?: string,
        @Query('withDeleted') withDeleted?: boolean,
        @Query('onlyDeleted') onlyDeleted?: boolean,
        @Query('select') select?: string[],
    ): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
        return this.productService.findAll(
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
        return await this.productService.findOneWithoutBuilder(id, {
            relations,
            select,
            withDeleted,
            onlyDeleted,
            findOrThrow,
        });
    }

    @Post()
    @Permissions('create-product')
    @ApiOperation({ summary: 'Create a product' })
    async create(@Body() createProductDto: CreateProductDto) {
        await this.productService.createProduct(createProductDto);
        return { message: 'Great! Product has been CREATED successfully', status: 201 };
    }

    @Put(':id')
    @Permissions('update-product')
    @ApiOperation({ summary: 'Update a product' })
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
        await this.productService.updateProduct(id, updateProductDto);
        return { message: 'Cool! Product has been UPDATED successfully', status: 200 };
    }

    @Delete(':id')
    @Permissions('delete-product')
    @ApiOperation({ summary: 'Delete a product' })
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        await this.productService.findOneByIdWithOptions(id);
        await this.productService.softDelete(id);
        return { message: 'Product has been DELETED successfully', status: 200 };
    }

    @Patch(':id/restore')
    @Permissions('restore-product')
    @ApiOperation({ summary: 'Restore a product' })
    async restore(@Param('id', ParseUUIDPipe) id: string) {
        await this.productService.restoreByUUID(id, true, ['productSKU']);
        return { message: 'Product has been RESTORED successfully', status: 200 };
    }

}
