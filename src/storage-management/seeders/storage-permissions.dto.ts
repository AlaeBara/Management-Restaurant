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
      { name: 'view-storages', label: 'Voir tous les Location de stockage', resource: 'storage' },
      { name: 'view-storage', label: 'Voir une Location de stockage spécifique', resource: 'storage' }, 
      { name: 'create-storage', label: 'Créer une nouvelle Location de stockage', resource: 'storage' },
      { name: 'update-storage', label: 'Modifier une Location de stockage', resource: 'storage' },
      { name: 'delete-storage', label: 'Supprimer une Location de stockage', resource: 'storage' },
      { name: 'restore-storage', label: 'Restaurer une Location de stockage supprimée', resource: 'storage' }
    ];

    const permissionRepository = this.connection.getRepository(Permission);
    //await permissionRepository.save(rolePermissions);
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
