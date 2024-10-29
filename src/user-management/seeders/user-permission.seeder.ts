
// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class UserPermissionSeeder {
    constructor(private readonly connection: Connection) { }

    async seed() {
        await this.seedUsers();
        console.log('User Permission Seeding completed!');
    }
    private async seedUsers() {


        const userPermissions = [
            { name: 'view-users', label: 'Voir tous les utilisateurs', resource: 'user' },
            { name: 'create-user', label: 'Créer un nouvel utilisateur', resource: 'user' },
            { name: 'view-user', label: 'Voir un utilisateur spécifique', resource: 'user' },
            { name: 'update-user', label: 'Mettre à jour un utilisateur existant', resource: 'user' },
            { name: 'delete-user', label: 'Supprimer un utilisateur', resource: 'user' },
            { name: 'restore-user', label: 'Restaurer un utilisateur supprimé', resource: 'user' },
            { name: 'grant-user-role', label: 'Accorder un rôle à un utilisateur', resource: 'user' },
            { name: 'update-user-status', label: 'Mettre à jour le statut d\'un utilisateur', resource: 'user' }, 
        ];

        const permissionRepository = this.connection.getRepository(Permission);
        //await permissionRepository.save(userPermissions);

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
