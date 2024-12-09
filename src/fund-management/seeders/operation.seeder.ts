// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Permission } from '../../user-management/entities/permission.entity';

@Injectable()
export class OperationsPermissionSeeder {
    constructor(private readonly connection: Connection) { }

    async seed() {
        await this.seedOperationPermissions();
        console.log('Opération Permission Seeding completed!');
    }

    private async seedOperationPermissions() {

        const operationPermissions = [
            { name: 'view-funds-operations', label: 'Voir toutes les opérations des caisses', resource: 'opération financière' },
            { name: 'create-fund-operation', label: 'Créer une nouvelle opération de caisse', resource: 'opération financière' },
            { name: 'create-expense', label: 'Créer une nouvelle d\'épense', resource: 'opération financière' },
            { name: 'approve-fund-operation', label: 'Approuver une opération de caisse', resource: 'opération financière' },
            { name: 'approve-transfer-fund-operation', label: 'Approuver opération de transfert de fonds', resource: 'opération financière' },
            { name: 'create-transfer-fund-operation', label: 'Créer une opération de transfert de fonds', resource: 'opération financière' },
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
