// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Permission } from '../entity/permission.entity';

@Injectable()
export class RolePermissionSeeder {
  constructor(private readonly connection: Connection) { }

  async seed() {
    await this.seedUsers();
    console.log('Role Permission Seeding completed!');
  }

  private async seedUsers() {


    const rolePermissions = [
      { name: 'view-roles', label: 'Voir tous les rôles', resource: 'role' },
      { name: 'create-role', label: 'Créer un nouveau rôle', resource: 'role' },
      { name: 'view-role', label: 'Voir un rôle spécifique', resource: 'role' },
      { name: 'update-role', label: 'Mettre à jour un rôle existant', resource: 'role' },
      { name: 'delete-role', label: 'Supprimer un rôle', resource: 'role' },
      { name: 'restore-role', label: 'Restaurer un rôle supprimé', resource: 'role' },
      { name: 'view-role-permissions', label: 'Voir les permissions d\'un rôle', resource: 'role' },
    ];

    const permissionRepository = this.connection.getRepository(Permission);
    //await permissionRepository.save(rolePermissions);
    for (const permissionData of rolePermissions) {
        const existingPermission = await permissionRepository.findOne({
            where: { name: permissionData.name }
        });

        if (!existingPermission) {
            await permissionRepository.save(permissionData);
        }
    }
  }
}
