// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Permission } from '../../user-management/entities/permission.entity';

@Injectable()
export class ZonePermissionSeeder {
  constructor(private readonly connection: Connection) { }

  async seed() {
    await this.seedUsers();
    console.log('Zone Permission Seeding completed!');
  }

  private async seedUsers() {


    const tablePermissions = [
      { name: 'manage-zone', label: 'Gérer une zone (créer, modifier, supprimer)', resource: 'zone' },
      { name: 'view-zone', label: 'Consulter une zone', resource: 'zone' },
    ];

    const permissionRepository = this.connection.getRepository(Permission);
    //await permissionRepository.save(rolePermissions);
    for (const permissionData of tablePermissions) {
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
