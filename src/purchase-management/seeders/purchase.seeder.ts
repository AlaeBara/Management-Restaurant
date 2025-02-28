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
        { name: 'view-purchase', label: 'Voir une ou plusieurs commandes d\'achat', resource: 'achat' },
        { name: 'manage-purchase', label: 'Gérer une commandes d\'achat (créer, modifier, supprimer)', resource: 'achat' },
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
