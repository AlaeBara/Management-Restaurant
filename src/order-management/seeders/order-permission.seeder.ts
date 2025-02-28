// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Permission } from '../../user-management/entities/permission.entity';

@Injectable()
export class OrderPermissionSeeder {
  constructor(private readonly connection: Connection) { }

  async seed() {
    await this.seedOrderPermissions();
    console.log('Order Permission Seeding completed!');
  }

  private async seedOrderPermissions() {

    const rolePermissions = [
      { name: 'view-order', label: 'Voir une ou plusieurs commandes', resource: 'order' },
      { name: 'manage-order', label: 'Gérer une commande (créer, modifier, supprimer)', resource: 'order' },
    ];

    const permissionRepository = this.connection.getRepository(Permission);
    //await permissionRepository.save(rolePermissions);
    for (const permissionData of rolePermissions) {
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
