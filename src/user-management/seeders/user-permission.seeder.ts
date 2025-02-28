
// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class UserPermissionSeeder {
    constructor(private readonly connection: Connection) { }

    async seed() {
        await this.seedUserPermissions();
        console.log('User Permission Seeding completed!');
    }
    private async seedUserPermissions() {

        const userPermissions = [
            { name: 'view-user', label: 'Voir un utilisateur', resource: 'utilisateur / personnel' },
            { name: 'manage-user', label: 'Gérer un utilisateur (créer, modifier, supprimer)', resource: 'utilisateur / personnel' },
        ];

        const permissionRepository = this.connection.getRepository(Permission);

        for (const permissionData of userPermissions) {
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
