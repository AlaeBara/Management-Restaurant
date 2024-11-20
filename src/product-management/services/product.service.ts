import { GenericService } from "src/common/services/generic.service";
import { Category } from "../entities/category.entity";
import { DataSource, Repository, UpdateResult } from "typeorm";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Product } from "../entities/product.entity";
import { CreateProductDto } from "../dtos/product/create-product.dto";
import { UpdateProductDto } from "../dtos/product/update-product.dto";
import { forwardRef, Inject, NotFoundException } from "@nestjs/common";
import { Unit } from "src/unit-management/entities/unit.entity";
import { UnitService } from "src/unit-management/services/unit.service";


export class ProductService extends GenericService<Product> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @Inject()
        private readonly unitService: UnitService,
    ) {
        super(dataSource, Product, 'product');
    }

    async assignUnit(product: Product, unit: Unit): Promise<void> {
        product.productUnit = unit;
    }

    async createProduct(createProductDto: CreateProductDto): Promise<Product> {
        await this.validateUnique({
            productSKU: createProductDto.productSKU,
            productName: createProductDto.productName
        });
        console.log(createProductDto);
        const product = await this.productRepository.create(createProductDto);
        if (createProductDto.unitId) {
            const unit = await this.unitService.findOneByIdWithOptions(createProductDto.unitId);
            await this.assignUnit(product, unit);
        }
        return this.productRepository.save(product);
    }

    async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
        const product = await this.findOneByIdWithOptions(id);

        if (updateProductDto.productSKU || updateProductDto.productName) {
            await this.validateUniqueExcludingSelf({
                productSKU: updateProductDto.productSKU,
                productName: updateProductDto.productName
            }, id);
        }

        if (updateProductDto.unitId) {
            const unit = await this.unitService.findOneByIdWithOptions(updateProductDto.unitId);
            await this.assignUnit(product, unit);
        }
        return this.productRepository.save(product);
    }

}
