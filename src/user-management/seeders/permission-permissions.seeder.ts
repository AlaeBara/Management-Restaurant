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
            { name: 'view-permission', label: 'Voir toutes les permissions', resource: 'permission' },
            { name: 'manage-permission', label: 'Gérer une permission (créer, modifier, supprimer)', resource: 'permission' },
        ];

        const permissionRepository = this.connection.getRepository(Permission);

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
