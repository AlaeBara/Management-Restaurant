
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
            { name: 'view-users', label: 'Voir tous les utilisateurs', resource: 'utilisateur / personnel' },
            { name: 'create-user', label: 'Créer un nouvel utilisateur', resource: 'utilisateur / personnel' },
            { name: 'view-user', label: 'Voir un utilisateur spécifique', resource: 'utilisateur / personnel' },
            { name: 'update-user', label: 'Mettre à jour un utilisateur existant', resource: 'utilisateur / personnel' },
            { name: 'delete-user', label: 'Supprimer un utilisateur', resource: 'utilisateur / personnel' },
            { name: 'restore-user', label: 'Restaurer un utilisateur supprimé', resource: 'utilisateur / personnel' },
            { name: 'grant-user-role', label: 'Accorder un rôle à un utilisateur', resource: 'utilisateur / personnel' },
            { name: 'update-user-status', label: 'Mettre à jour le statut d\'un utilisateur', resource: 'utilisateur / personnel' }, 
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
