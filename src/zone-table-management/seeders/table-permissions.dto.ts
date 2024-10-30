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
        { name: 'view-tables', label: 'Consulter toutes les tables', resource: 'table' },
        { name: 'view-table', label: 'Consulter une table spécifique', resource: 'table' },
        { name: 'create-table', label: 'Ajouter une nouvelle table', resource: 'table' },
        { name: 'update-table', label: 'Modifier une table', resource: 'table' },
        { name: 'delete-table', label: 'Supprimer une table', resource: 'table' },
        { name: 'restore-table', label: 'Récupérer une table supprimée', resource: 'table' }
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
