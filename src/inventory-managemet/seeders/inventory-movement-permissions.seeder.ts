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
      { name: 'view-inventories-movements', label: 'View all inventory movements', resource: 'inventory-movement' },
      { name: 'create-inventory-movement', label: 'Create new inventory movement', resource: 'inventory-movement' },
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
