// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class RolePermissionSeeder {
  constructor(private readonly connection: Connection) { }

  async seed() {
    await this.seedRolePermissions();
    console.log('Role Permission Seeding completed!');
  }

  private async seedRolePermissions() {

    const rolePermissions = [
      { name: 'view-role', label: 'Voir un rôle', resource: 'role' },
      { name: 'manage-role', label: 'Gérer un rôle (créer, modifier, supprimer)', resource: 'role' },
    ];

    const permissionRepository = this.connection.getRepository(Permission);
    //await permissionRepository.save(rolePermissions);
    for (const permissionData of rolePermissions) {
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
