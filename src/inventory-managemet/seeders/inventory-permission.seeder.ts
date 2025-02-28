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
            { name: 'view-inventory', label: 'Voir tous les stocks', resource: 'inventaire' },
            { name: 'manage-inventory', label: 'Créer, modifier ou supprimer un stock', resource: 'inventaire' },
            { name: 'view-inventory-movement', label: 'Voir historique des opérations de stock', resource: 'inventaire' },
            { name: 'manage-inventory-movement', label: 'Créer, modifier ou supprimer une opération de stock', resource: 'inventaire' },
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
