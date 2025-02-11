import { DeleteResult, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { GenericService } from "src/common/services/generic.service";
import { Inventory } from "../entities/inventory.entity";
import { DataSource } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ProductService } from "src/product-management/services/product.service";
import { StorageService } from "src/storage-management/services/storage.service";
import { CreateInventoryDto } from "../dtos/inventory/create-inventory.dto";
import { UpdateInventoryDto } from "../dtos/inventory/update-inventory.dto";
import { UnitService } from "src/unit-management/services/unit.service";

@Injectable()
export class InventoryService extends GenericService<Inventory> {

    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(Inventory)
        readonly inventoryRepository: Repository<Inventory>,
        @Inject(forwardRef(() => ProductService))
        private readonly productService: ProductService,
        @Inject(forwardRef(() => StorageService))
        private readonly storageService: StorageService,
        @Inject(forwardRef(() => UnitService))
        private readonly unitService: UnitService,
    ) {
        super(dataSource, Inventory, 'inventaire');
    }

    async assignProduct(inventory: Inventory, productId: string | number): Promise<void> {
        const product = await this.productService.findOneByIdWithOptions(productId);
        inventory.product = product;
    }

    async assignStorage(inventory: Inventory, storageId: string | number): Promise<void> {
        const storage = await this.storageService.findOneByIdWithOptions(storageId);
        inventory.storage = storage;
    }

    async assignUnit(inventory: Inventory, unitId: string | number): Promise<void> {
        const unit = await this.unitService.findOneByIdWithOptions(unitId);
        inventory.unit = unit;
    }


    async createInventory(createInventoryDto: CreateInventoryDto) {
        const inventory = this.inventoryRepository.create(createInventoryDto);

        await this.validateUnique({ sku: inventory.sku })

        if (createInventoryDto.productId) {
            await this.assignProduct(inventory, createInventoryDto.productId);
        }

        if (createInventoryDto.storageId) {
            await this.assignStorage(inventory, createInventoryDto.storageId);
        }

        if (createInventoryDto.unitId) {
            await this.assignUnit(inventory, createInventoryDto.unitId);
        }

        return this.inventoryRepository.save(inventory);
    }

    async updateInventory(id: string, updateInventoryDto: UpdateInventoryDto) {
        await this.validateUniqueExcludingSelf({ sku: updateInventoryDto.sku });
        const inventory = await this.findOneByIdWithOptions(id);

        if (updateInventoryDto.storageId) {
            await this.assignStorage(inventory, updateInventoryDto.storageId);
        }

        if (updateInventoryDto.productId) {
            await this.assignProduct(inventory, updateInventoryDto.productId);
        }

        if (updateInventoryDto.unitId) {
            await this.assignUnit(inventory, updateInventoryDto.unitId);
        }

        Object.assign(inventory, updateInventoryDto);
        return this.inventoryRepository.save(inventory);
    }

    async deleteInventory(id: string): Promise<DeleteResult> {
        return this.inventoryRepository.softDelete(id);
    }

    async getInventoryByProductId(productId: string): Promise<Inventory[]> {
        return this.inventoryRepository.find({ where: { product: { id: productId } } });
    }
}