// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Permission } from '../../user-management/entities/permission.entity';

@Injectable()
export class TablePermissionSeeder {
  constructor(private readonly connection: Connection) { }

  async seed() {
    await this.seedUsers();
    console.log('Table Permission Seeding completed!');
  }

  private async seedUsers() {


    const tablePermissions = [
        { name: 'view-table', label: 'Consulter une ou plusieurs tables', resource: 'table' },
        { name: 'manage-table', label: 'Gérer une table (créer, modifier, supprimer)', resource: 'table' },
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
