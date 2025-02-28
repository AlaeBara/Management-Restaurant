// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Permission } from '../../user-management/entities/permission.entity';

@Injectable()
export class CategoryPermissionSeeder {
  constructor(private readonly connection: Connection) { }

  async seed() {
    await this.seedCategoryPermissions();
    console.log('Category Permission Seeding completed!');
  }

  private async seedCategoryPermissions() {

    const categoryPermissions = [
      { name: 'view-category', label: 'Voir une ou plusieurs catégories', resource: 'category' },
      { name: 'manage-category', label: 'Gérer une catégorie (créer, modifier, supprimer)', resource: 'category' },
    ];

    const permissionRepository = this.connection.getRepository(Permission);

    for (const permissionData of categoryPermissions) {
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
