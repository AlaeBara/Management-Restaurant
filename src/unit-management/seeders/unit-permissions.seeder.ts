// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Permission } from 'src/user-management/entities/permission.entity';

@Injectable()
export class UnitPermissionsSeeder {
    constructor(private readonly connection: Connection) { }

    async seed() {
        await this.seedUnitPermissions();
        console.log('Unit Permissions Seeding completed!');
    }

    private async seedUnitPermissions() {

        const permissionPermissions = [
            { name: 'view-units', label: 'Voir toutes les unités', resource: 'unit' },
            { name: 'create-unit', label: 'Créer une nouvelle unité', resource: 'unit' },
            { name: 'view-unit', label: 'Voir une unité spécifique', resource: 'unit' },
            { name: 'update-unit', label: 'Mettre à jour une unité existante', resource: 'unit' },
            { name: 'delete-unit', label: 'Supprimer une unité', resource: 'unit' },
            { name: 'restore-unit', label: 'Restaurer une unité supprimée', resource: 'unit' }
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
