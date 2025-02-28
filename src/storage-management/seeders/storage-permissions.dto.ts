// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Permission } from '../../user-management/entities/permission.entity';

@Injectable()
export class StoragePermissionSeeder {
  constructor(private readonly connection: Connection) { }

  async seed() {
    await this.seedUsers();
    console.log('Storage Permission Seeding completed!');
  }

  private async seedUsers() {

    const storagePermissions = [
      { name: 'view-location-storage', label: 'Voir tous les Location de stockage', resource: 'placement de stockage' }, 
      { name: 'manage-location-storage', label: 'Créer, modifier ou supprimer une Location de stockage', resource: 'placement de stockage' },
    ];

    const permissionRepository = this.connection.getRepository(Permission);
    
    for (const permissionData of storagePermissions) {
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
