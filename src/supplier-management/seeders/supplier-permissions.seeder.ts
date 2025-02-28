// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Permission } from 'src/user-management/entities/permission.entity';

@Injectable()
export class SupplierPermissionsSeeder {
    constructor(private readonly connection: Connection) { }

    async seed() {
        await this.seedSupplierPermissions();
        console.log('Supplier Permissions Seeding completed!');
    }

    private async seedSupplierPermissions() {

        const permissionPermissions = [
            { name: 'view-supplier', label: 'Voir un fournisseur', resource: 'fournisseur' },
            { name: 'manage-supplier', label: 'Créer, modifier ou supprimer un fournisseur', resource: 'fournisseur' }
        ];

        const permissionRepository = this.connection.getRepository(Permission);
        //await permissionRepository.save(permissionPermissions);

        for (const permissionData of permissionPermissions) {
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
