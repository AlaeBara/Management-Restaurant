// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Permission } from '../../user-management/entities/permission.entity';

@Injectable()
export class ClientPermissionSeeder {
  constructor(private readonly connection: Connection) { }

  async seed() {
    await this.seedClientPermissions();
    console.log('Client Permission Seeding completed!');
  }

  private async seedClientPermissions() {


    const rolePermissions = [
      { name: 'view-clients', label: 'Voir tous les clients', resource: 'client' },
      { name: 'view-client', label: 'Voir un client spécifique', resource: 'client' },
      { name: 'create-client', label: 'Créer un nouveau client', resource: 'client' },
      { name: 'update-client', label: 'Mettre à jour un client existant', resource: 'client' },
      { name: 'delete-client', label: 'Supprimer un client', resource: 'client' },
      { name: 'restore-client', label: 'Restaurer un client supprimé', resource: 'client' }
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
