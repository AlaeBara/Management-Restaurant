import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericService } from "src/common/services/generic.service";
import { Inventory } from "../entities/inventory.entity";
import { DataSource } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { ProductService } from "src/product-management/services/product.service";
import { Product } from "src/product-management/entities/product.entity";
import { Storage } from "src/storage-management/entities/storage.entity";
import { StorageService } from "src/storage-management/services/storage.service";
import { CreateInventoryDto } from "../dtos/create-inventory.dto";
import { UpdateInventoryDto } from "../dtos/update-inventory.dto";

@Injectable()
export class InventoryService extends GenericService<Inventory> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(Inventory)
        readonly inventoryRepository: Repository<Inventory>,
        @Inject()
        private readonly productService: ProductService,
        @Inject()
        private readonly storageService: StorageService,
    ) {
        super(dataSource, Inventory, 'inventory');
    }

    async assignProduct(inventory: Inventory, productId: string | number): Promise<void> {
        const product = await this.productService.findOneByIdWithOptions(productId);
        inventory.product = product;
    }

    async assignStorage(inventory: Inventory, storageId: string | number): Promise<void> {
        const storage = await this.storageService.findOneByIdWithOptions(storageId);
        inventory.storage = storage;
    }

    async createInventory(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
        const inventory = this.inventoryRepository.create(createInventoryDto);

        if (createInventoryDto.productId) {
            await this.assignProduct(inventory, createInventoryDto.productId);
        }

        if (createInventoryDto.storageId) {
            await this.assignStorage(inventory, createInventoryDto.storageId);
        }

        return this.inventoryRepository.save(inventory);
    }

    async updateInventory(id: string, updateInventoryDto: UpdateInventoryDto): Promise<UpdateResult> {
        return this.inventoryRepository.update(id, updateInventoryDto);
    }

    async deleteInventory(id: string): Promise<DeleteResult> {
        return this.inventoryRepository.delete(id);
    }
}