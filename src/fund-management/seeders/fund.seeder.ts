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
            { name: 'view-funds', label: 'Voir tous les fonds', resource: 'fonds' },
            { name: 'view-fund', label: 'Voir un fonds unique', resource: 'fonds' },
            { name: 'create-fund', label: 'Créer un nouveau fonds', resource: 'fonds' },    
            { name: 'update-fund', label: 'Mettre à jour un fonds', resource: 'fonds' },
            { name: 'delete-fund', label: 'Supprimer un fonds', resource: 'fonds' },
            { name: 'restore-fund', label: 'Restaurer un fonds supprimé', resource: 'fonds' },
            { name: 'view-fund-operations', label: 'Voir historique des opérations de fonds', resource: 'fonds' }
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
