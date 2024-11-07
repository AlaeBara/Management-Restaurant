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
      { name: 'view-storages', label: 'View all storages', resource: 'storage' },
      { name: 'view-storage', label: 'View specific storage', resource: 'storage' }, 
      { name: 'create-storage', label: 'Create new storage', resource: 'storage' },
      { name: 'update-storage', label: 'Update storage', resource: 'storage' },
      { name: 'delete-storage', label: 'Delete storage', resource: 'storage' },
      { name: 'restore-storage', label: 'Restore deleted storage', resource: 'storage' }
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
