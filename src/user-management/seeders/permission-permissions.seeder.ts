// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionPermissionsSeeder {
    constructor(private readonly connection: Connection) { }

    async seed() {
        await this.seedPermissionPermissions();
        console.log('Permission Permissions Seeding completed!');
    }

    private async seedPermissionPermissions() {


        const permissionPermissions = [
            { name: 'view-permissions', label: 'Voir toutes les permissions', resource: 'permission' },
            { name: 'create-permission', label: 'Créer une nouvelle permission', resource: 'permission' },
            { name: 'view-permission', label: 'Voir une permission spécifique', resource: 'permission' },
            { name: 'update-permission', label: 'Mettre à jour une permission existante', resource: 'permission' },
            { name: 'delete-permission', label: 'Supprimer une permission', resource: 'permission' },
            { name: 'restore-permission', label: 'Restaurer une permission supprimée', resource: 'permission' },
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
