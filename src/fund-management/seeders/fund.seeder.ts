// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Permission } from '../../user-management/entities/permission.entity';

@Injectable()
export class FundPermissionSeeder {
    constructor(private readonly connection: Connection) { }

    async seed() {
        await this.seedFundPermissions();
        console.log('Fund Permission Seeding completed!');
    }

    private async seedFundPermissions() {

        const fundPermissions =  [
            { name: 'view-funds', label: 'Voir tous les fonds', resource: 'caisse / fund' },
            { name: 'view-fund', label: 'Voir un fonds unique', resource: 'caisse / fund' },
            { name: 'create-fund', label: 'Cr er un nouveau fonds', resource: 'caisse / fund' },    
            { name: 'update-fund', label: 'Mettre  jour un fonds', resource: 'caisse / fund' },
            { name: 'delete-fund', label: 'Supprimer un fonds', resource: 'caisse / fund' },
            { name: 'restore-fund', label: 'Restaurer un fonds supprim ', resource: 'caisse / fund' },
            { name: 'view-fund-operations', label: 'Voir les op rations de fonds', resource: 'caisse / fund' }
        ];

        const permissionRepository = this.connection.getRepository(Permission);

        for (const permissionData of fundPermissions) {
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
