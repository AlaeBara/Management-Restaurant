// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Permission } from '../../user-management/entities/permission.entity';

@Injectable()
export class ProductPermissionSeeder {
  constructor(private readonly connection: Connection) { }

  async seed() {
    await this.seedProductPermissions();
    console.log('Product Permission Seeding completed!');
  }

  private async seedProductPermissions() {

    const productPermissions = [
        { name: 'view-products', label: 'Voir tous les produits', resource: 'product' },
        { name: 'view-product', label: 'Voir un produit spécifique', resource: 'product' },
        { name: 'create-product', label: 'Créer un nouveau produit', resource: 'product' },
        { name: 'update-product', label: 'Modifier un produit', resource: 'product' },
        { name: 'delete-product', label: 'Supprimer un produit', resource: 'product' },
        { name: 'restore-product', label: 'Restaurer un produit supprimé', resource: 'product' }
    ];

    const permissionRepository = this.connection.getRepository(Permission);

    for (const permissionData of productPermissions) {
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
