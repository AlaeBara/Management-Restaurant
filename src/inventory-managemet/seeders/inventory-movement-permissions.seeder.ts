// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Permission } from '../../user-management/entities/permission.entity';

@Injectable()
export class InventoryMovementPermissionSeeder {
  constructor(private readonly connection: Connection) { }

  async seed() {
    await this.seedInventoryMovementPermissions();
    console.log('Inventory Movement Permission Seeding completed!');
  }

  private async seedInventoryMovementPermissions() {

    const inventoryMovementPermissions = [
      { name: 'view-inventories-movements', label: 'Voir tous les mouvements de stock', resource: 'mouvement d\'inventaire' },
      { name: 'create-inventory-movement', label: 'Créer un nouveau mouvement de stock', resource: 'mouvement d\'inventaire' },
      { name: 'create-transfer-inventory-movement', label: 'Créer un transfert de stock', resource: 'mouvement d\'inventaire' },
    ];

    const permissionRepository = this.connection.getRepository(Permission);

    for (const permissionData of inventoryMovementPermissions) {
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
