// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Permission } from '../../user-management/entities/permission.entity';

@Injectable()
export class FundPermissionSeeder {
    constructor(private readonly connection: Connection) { }

    async seed() {
        await this.seedFundPermissions();
        console.log('Fond Permission Seeding completed!');
    }

    private async seedFundPermissions() {

        const fundPermissions =  [
            { name: 'view-fund', label: 'Voir une ou plusieurs caisses', resource: 'caisse' },
            { name: 'view-fund-operation', label: 'Voir historique des opérations de caisse', resource: 'caisse' },
            { name: 'view-expense', label: 'Voir une ou plusieurs dépenses', resource: 'caisse' },
            { name: 'manage-fund', label: 'Créer, modifier ou supprimer une caisse', resource: 'caisse' },
            { name: 'manage-fund-operation', label: 'Créer, modifier ou supprimer une opération de caisse', resource: 'caisse' },
            { name: 'manage-expense', label: 'Créer, modifier ou supprimer une dépense', resource: 'caisse' }
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
