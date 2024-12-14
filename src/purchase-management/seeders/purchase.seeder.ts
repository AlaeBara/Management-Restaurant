// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Permission } from '../../user-management/entities/permission.entity';

@Injectable()
export class PurchasePermissionSeeder {
  constructor(private readonly connection: Connection) { }

  async seed() {
    await this.seedPurchasePermissions();
    console.log('Purchase Permission Seeding completed!');
  }

  private async seedPurchasePermissions() {

    const purchasePermissions = [
        { name: 'view-purchases', label: 'Voir toutes les commandes d\'achat', resource: 'achat' },
        { name: 'view-purchase', label: 'Voir une commande d\'achat spécifique', resource: 'achat' },
        { name: 'create-purchase', label: 'Créer une nouvelle commande d\'achat', resource: 'achat' },
        { name: 'delete-purchase', label: 'Supprimer une commande d\'achat', resource: 'achat' },
        { name: 'create-purchase-item', label: 'Créer une ligne de commande d\'achat', resource: 'achat' },
        { name: 'delete-purchase-item', label: 'Supprimer une ligne de commande d\'achat', resource: 'achat' },
        { name: 'execute-purchase-movement', label: 'Exécuter un déplacement de ligne de commande d\'achat', resource: 'achat' }
    ];

    const permissionRepository = this.connection.getRepository(Permission);

    for (const permissionData of purchasePermissions) {
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
