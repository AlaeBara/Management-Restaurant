import { DataSource, Repository } from "typeorm";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";

import { GenericService } from "src/common/services/generic.service";
import { Product } from "../entities/product.entity";
import { CreateProductDto } from "../dtos/product/create-product.dto";
import { UpdateProductDto } from "../dtos/product/update-product.dto";

export class ProductService extends GenericService<Product> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {
        super(dataSource, Product, 'product');
    }

    async createProduct(createProductDto: CreateProductDto): Promise<Product> {
        await this.validateUnique({
            productSKU: createProductDto.productSKU,
            productName: createProductDto.productName
        });
        const product = await this.productRepository.create(createProductDto);
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

        Object.assign(product, updateProductDto);
        return this.productRepository.save(product);
    }
}
