import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { GenericService } from 'src/common/services/generic.service';
import { Storage } from '../entities/storage.entity';
import { CreateStorageDto } from '../dtos/create-storage.dto';
import { UpdateStorageDto } from '../dtos/update-storage.dto';
import FindOneOptions from 'src/common/interface/findoneoption.interface';
import { Inventory } from 'src/inventory-managemet/entities/inventory.entity';
import { AssignParentStorageDto } from '../dtos/assign-parentStorage.dto';

@Injectable()
export class StorageService extends GenericService<Storage> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(Storage)
        private storageRepository: Repository<Storage>,
        @InjectRepository(Inventory)
        private inventoryRepository: Repository<Inventory>,
    ) {
        super(dataSource, Storage, 'storage');
    }

    async findAllWithHierarchy(page?: number | string,
        limit?: number | string,
        relations?: string[],
        sort?: string,
        withDeleted: boolean = false,
        onlyDeleted: boolean = false,
        select?: string[]): Promise<{ data: Storage[]; total: number; page: number; limit: number }> {
        const storages = await this.findAll(page, limit, ['parentStorage'], sort, withDeleted, onlyDeleted, select);
        storages.data = await Promise.all(storages.data.map(async (storage) => await this.sethierarchyPath(storage)));
        return storages;
    }

    async sethierarchyPath(storage: Storage): Promise<Storage> {
        let tempStorage = storage;
        let fullStorage: string[] = [storage.storageName]; // Include current storage name

        while (tempStorage.parentStorage) {
            tempStorage = await this.findOneByIdWithOptions(tempStorage.parentStorageId, {
                relations: ['parentStorage'],
            });
            fullStorage.push(tempStorage.storageName); // Push to end since we start with current storage
        }

        storage.hierarchyPath = fullStorage.reverse().join(' > ');
        return storage;
    }

    async createStorage(createStorageDto: CreateStorageDto): Promise<Storage> {
        await this.validateUnique({
            storageCode: createStorageDto.storageCode,
        })

        const storage = this.storageRepository.create(createStorageDto);

        if (createStorageDto.parentStorageId) {
            const parentStorage = await this.findById(createStorageDto.parentStorageId);
            if (!parentStorage) {
                throw new NotFoundException('Sub storage not found');
            }
            storage.parentStorage = parentStorage;
        }

        try {
            return await this.storageRepository.save(storage);
        } catch (error) {
            throw new BadRequestException(`Failed to create storage: ${error.message}`);
        }
    }

    async getStorageWithHierarchy(id: string, options: Partial<FindOneOptions>): Promise<Storage> {
        const storage = await this.findOneByIdWithOptions(id, {
            ...options,
            relations: ['parentStorage'],
        });

        let tempStorage = storage;
        let fullStorage: string[] = [storage.storageName]; // Include current storage name

        while (tempStorage.parentStorage) {
            tempStorage = await this.findOneByIdWithOptions(tempStorage.parentStorageId, {
                relations: ['parentStorage'],
            });
            fullStorage.push(tempStorage.storageName); // Push to end since we start with current storage
        }

        storage.hierarchyPath = fullStorage.reverse().join(' > ');
        return storage;
    }



    async updateStorage(id: string, updateStorageDto: UpdateStorageDto): Promise<Storage> {
        const storage = await this.findOneByIdWithOptions(id);

        if (updateStorageDto.storageCode) {
            await this.validateUniqueExcludingSelf({
                storageCode: updateStorageDto.storageCode,
            }, id)
            storage.storageCode = updateStorageDto.storageCode;
        }

        if (updateStorageDto.parentStorageId) {
            const parentStorage = await this.findOneByIdWithOptions(updateStorageDto.parentStorageId);
            await this.validateAssignParentStorage(storage, parentStorage);
            storage.parentStorage = parentStorage;
        }

        if (updateStorageDto.storageName) {
            storage.storageName = updateStorageDto.storageName;
        }

        return this.storageRepository.save(storage);
    }

    async validateAssignParentStorage(storage: Storage, assignParentStorage: Storage) {
        // Null checks should come first
        if (!storage) {
            throw new NotFoundException('Storage not found');
        }
        if (!assignParentStorage) {
            throw new NotFoundException('Sub storage not found');
        }

        // Check for self-assignment
        if (storage.id === assignParentStorage.id) {
            throw new BadRequestException('Storage cannot be its own sub-storage');
        }

        // Check if the same sub-storage is already assigned
        if (storage.parentStorageId === assignParentStorage.id) {
            throw new BadRequestException('Sub storage is already assigned to this storage');
        }

        // Additional check for circular reference (if needed)
        // This would prevent A -> B -> A scenarios
        if (assignParentStorage.parentStorageId === storage.id) {
            throw new BadRequestException('Circular reference detected - cannot create storage loop');
        }
    }

    async assignParentStorage(id: string, assignParentStorageDto: AssignParentStorageDto) {
        const storage = await this.findOneByIdWithOptions(id);
        const parentStorage = await this.findOneByIdWithOptions(assignParentStorageDto.parentStorageId);
        await this.validateAssignParentStorage(storage, parentStorage);
        storage.parentStorage = parentStorage;
        return this.storageRepository.save(storage);
    }

    async validateDeleteStorage(storage: Storage) {
        if (storage.parentStorage) {
            throw new BadRequestException('Cannot delete storage with linked sub-storages. Please remove sub-storage links first.');
        }

        const hasParentStorage = await this.storageRepository.count({
            where: {
                parentStorage: { id: storage.id }
            }
        });

        if (hasParentStorage && hasParentStorage > 0) {
            throw new BadRequestException('Cannot delete storage as it is linked as a sub-storage to another storage. Please remove the link first.');
        }

        const hasInventory = await this.inventoryRepository.count({
            where: {
                storage: { id: storage.id }
            }
        });

        if (hasInventory && hasInventory > 0) {
            throw new BadRequestException('Cannot delete storage as it is linked to an inventory. Please remove the link first.');
        }
    }

    async deleteStorage(id: string): Promise<DeleteResult> {
        const storage = await this.findOneByIdWithOptions(id, { relations: 'parentStorage' });
        await this.validateDeleteStorage(storage);
        return await this.softDelete(id);
    }
}