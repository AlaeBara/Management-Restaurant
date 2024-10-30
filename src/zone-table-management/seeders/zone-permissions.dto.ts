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
      { name: 'view-zones', label: 'Consulter toutes les zones', resource: 'zone' },
      { name: 'view-zone', label: 'Consulter une zone spécifique', resource: 'zone' },
      { name: 'create-zone', label: 'Ajouter une nouvelle zone', resource: 'zone' },
      { name: 'update-zone', label: 'Modifier une zone', resource: 'zone' },
      { name: 'delete-zone', label: 'Supprimer une zone', resource: 'zone' },
      { name: 'restore-zone', label: 'Récupérer une zone supprimée', resource: 'zone' },
      { name: 'reassign-zone', label: 'Réorganiser les zones', resource: 'zone' },
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
