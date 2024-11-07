import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, DeleteResult, Repository, Table } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { GenericService } from 'src/common/services/generic.service';
import { Storage } from '../entities/storage.entity';
import { CreateStorageDto } from '../dtos/create-storage.dto';
import { UpdateStorageDto } from '../dtos/update-storage.dto';
import { AssignSubStorageDto } from '../dtos/assign-subStorage.dto';

@Injectable()
export class StorageService extends GenericService<Storage> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(Storage)
        private storageRepository: Repository<Storage>,

    ) {
        super(dataSource, Storage, 'storage');
    }

    async createStorage(createStorageDto: CreateStorageDto): Promise<Storage> {
        await this.validateUnique({
            storageCode: createStorageDto.storageCode,
        })

        const storage = this.storageRepository.create(createStorageDto);

        if (createStorageDto.subStorageId) {
            const subStorage = await this.findById(createStorageDto.subStorageId);
            if (!subStorage) {
                throw new NotFoundException('Sub storage not found');
            }
            storage.subStorage = subStorage;
        }

        try {
            return await this.storageRepository.save(storage);
        } catch (error) {
            throw new BadRequestException(`Failed to create storage: ${error.message}`);
        }
    }

    async updateStorage(id: string, updateStorageDto: UpdateStorageDto): Promise<Storage> {
        const storage = await this.findOneByIdWithOptions(id);

        if (updateStorageDto.storageCode) {
            await this.validateUniqueExcludingSelf({
                storageCode: updateStorageDto.storageCode,
            }, id)
            storage.storageCode = updateStorageDto.storageCode;
        }

        if (updateStorageDto.subStorageId) {
            const subStorage = await this.findOneByIdWithOptions(updateStorageDto.subStorageId);
            await this.validateAssignSubStorage(storage, subStorage);
            storage.subStorage = subStorage;
        }

        if (updateStorageDto.storageName) {
            storage.storageName = updateStorageDto.storageName;
        }

        if (updateStorageDto.storagePlace) {
            storage.storagePlace = updateStorageDto.storagePlace;
        }

        return this.storageRepository.save(storage);
    }

    async validateAssignSubStorage(storage: Storage, assignSubStorage: Storage) {
        // Null checks should come first
        if (!storage) {
            throw new NotFoundException('Storage not found');
        }
        if (!assignSubStorage) {
            throw new NotFoundException('Sub storage not found');
        }

        // Check for self-assignment
        if (storage.id === assignSubStorage.id) {
            throw new BadRequestException('Storage cannot be its own sub-storage');
        }

        // Check if the same sub-storage is already assigned
        if (storage.subStorageId === assignSubStorage.id) {
            throw new BadRequestException('Sub storage is already assigned to this storage');
        }

        // Additional check for circular reference (if needed)
        // This would prevent A -> B -> A scenarios
        if (assignSubStorage.subStorageId === storage.id) {
            throw new BadRequestException('Circular reference detected - cannot create storage loop');
        }
    }

    async assignSubStorage(id: string, assignSubStorageDto: AssignSubStorageDto) {
        const storage = await this.findOneByIdWithOptions(id);
        const subStorage = await this.findOneByIdWithOptions(assignSubStorageDto.subStorageId);
        await this.validateAssignSubStorage(storage, subStorage);
        storage.subStorage = subStorage;
        return this.storageRepository.save(storage);
    }

    async deleteStorage(id: string): Promise<DeleteResult> {
        const storage = await this.findOneByIdWithOptions(id, { relations: 'subStorage' });

        if (storage.subStorage) {
            throw new BadRequestException('Cannot delete storage with linked sub-storages. Please remove sub-storage links first.');
        }
        console.log(storage);
        const hasParentStorage = await this.storageRepository.count({
            where: {
                subStorage: { id: storage.id }
            }
        });
        console.log(hasParentStorage);


        if (hasParentStorage &&hasParentStorage > 0) {
            throw new BadRequestException('Cannot delete storage as it is linked as a sub-storage to another storage. Please remove the link first.');
        }

        return await this.softDelete(id);
    }
}