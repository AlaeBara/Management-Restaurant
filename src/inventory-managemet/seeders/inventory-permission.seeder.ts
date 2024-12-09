// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Permission } from '../../user-management/entities/permission.entity';

@Injectable()
export class InventoryPermissionSeeder {
    constructor(private readonly connection: Connection) { }

    async seed() {
        await this.seedInventoryPermissions();
        console.log('Inventory Permission Seeding completed!');
    }

    private async seedInventoryPermissions() {

        const inventoryPermissions = [
            { name: 'view-inventories', label: 'Voir tous les stocks', resource: 'inventaire' },
            { name: 'view-inventory', label: 'Voir un stock spécifique', resource: 'inventaire' },
            { name: 'create-inventory', label: 'Créer un nouveau stock', resource: 'inventaire' },
            { name: 'update-inventory', label: 'Mettre à jour un stock existant', resource: 'inventaire' },
            { name: 'delete-inventory', label: 'Supprimer un stock', resource: 'inventaire' },
            { name: 'restore-inventory', label: 'Restaurer un stock supprimé', resource: 'inventaire' }
        ];

        const permissionRepository = this.connection.getRepository(Permission);
        for (const permissionData of inventoryPermissions) {
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
