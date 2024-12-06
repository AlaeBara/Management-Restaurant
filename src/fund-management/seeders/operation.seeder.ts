// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Permission } from '../../user-management/entities/permission.entity';

@Injectable()
export class OperationsPermissionSeeder {
    constructor(private readonly connection: Connection) { }

    async seed() {
        await this.seedOperationPermissions();
        console.log('Operation Permission Seeding completed!');
    }

    private async seedOperationPermissions() {

        const operationPermissions = [
            { name: 'view-funds-operations', label: 'Voir toutes les op rations des caisses', resource: 'caisse opration' },
            { name: 'create-fund-operation', label: 'Cr er une nouvelle op ration de caisse', resource: 'caisse opration' },
            { name: 'create-expense', label: 'Cr er une nouvelle d pense', resource: 'caisse opration' },
            { name: 'approve-fund-operation', label: 'Approuver une op ration de caisse', resource: 'caisse opration' },
        ];

        const permissionRepository = this.connection.getRepository(Permission);

        for (const permissionData of operationPermissions) {
            const existingPermission = await permissionRepository.findOne({
                where: { name: permissionData.name },
                withDeleted: true
            });

            if (!existingPermission) {
                await permissionRepository.save(permissionData);
            }
        }
    }
}
