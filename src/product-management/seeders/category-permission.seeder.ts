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
        { name: 'view-categories', label: 'Voir toutes les catégories', resource: 'category' },
        { name: 'view-category', label: 'Voir une catégorie spécifique', resource: 'category' },
        { name: 'create-category', label: 'Créer une nouvelle catégorie', resource: 'category' },
        { name: 'update-category', label: 'Modifier une catégorie', resource: 'category' },
        { name: 'delete-category', label: 'Supprimer une catégorie', resource: 'category' },
        { name: 'restore-category', label: 'Restaurer une catégorie supprimée', resource: 'category' }
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
