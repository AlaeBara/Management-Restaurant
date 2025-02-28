// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Permission } from '../../user-management/entities/permission.entity';

@Injectable()
export class MenuItemSeeder {
  constructor(private readonly connection: Connection) { }

  async seed() {
    await this.seedMenuItems();
    console.log('MenuItem Seeding completed!');
  }

  private async seedMenuItems() {

    const menuItemPermissions = [
      { name: 'view-menu-item', label: 'Voir un ou plusieurs articles de menu', resource: 'article-de-menu' },
      { name: 'manage-menu-item', label: 'Gérer un ou plusieurs articles de menu (créer, modifier, supprimer)', resource: 'article-de-menu' },
      { name: 'view-choice', label: 'Voir un choix', resource: 'choix' },
      { name: 'manage-choice', label: 'Gérer un choix (créer, modifier, supprimer)', resource: 'choix' },
      { name: 'view-discount', label: 'Voir une ou plusieurs remises', resource: 'remise' },
      { name: 'manage-discount', label: 'Gérer une remise (créer, modifier, supprimer)', resource: 'remise' },
      { name: 'view-tag', label: 'Voir un ou plusieurs tags', resource: 'tag' },
      { name: 'manage-tag', label: 'Gérer un tag (créer, modifier, supprimer)', resource: 'tag' },
    ];

    const permissionRepository = this.connection.getRepository(Permission);
    //await permissionRepository.save(rolePermissions);
    for (const permissionData of menuItemPermissions) {
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
