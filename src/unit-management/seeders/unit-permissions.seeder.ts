// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Permission } from 'src/user-management/entities/permission.entity';

@Injectable()
export class UnitPermissionsSeeder {
    constructor(private readonly connection: Connection) { }

    async seed() {
        await this.seedUnitPermissions();
        console.log('Unit Permissions Seeding completed!');
    }

    private async seedUnitPermissions() {

        const permissionPermissions = [
            { name: 'view-unit', label: 'Voir une ou plusieurs unités', resource: 'unit' },
            { name: 'manage-unit', label: 'Créer, modifier ou supprimer une unité', resource: 'unit' }
        ];

        const permissionRepository = this.connection.getRepository(Permission);

        for (const permissionData of permissionPermissions) {
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
