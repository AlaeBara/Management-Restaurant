// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Permission } from '../../user-management/entities/permission.entity';

@Injectable()
export class ShiftZonePermissionSeeder {
    constructor(private readonly connection: Connection) { }

    async seed() {
        await this.seedUsers();
        console.log('Shift Permission Seeding completed!');
    }

    private async seedUsers() {


        const shiftPermissions = [
            { name: 'start-shift-by-waiter', label: 'Demarrer un service pour un serveur', resource: 'session de travail' },
            { name: 'end-shift-by-waiter', label: 'Terminer un service pour un serveur', resource: 'session de travail' },
            { name: 'request-shift-reassignment-by-waiter', label: 'Demander une reaffectation de service', resource: 'session de travail' },
            { name: 'response-reassignment-shift-request-by-waiter-or-responsable', label: 'Respondre  la demande de reaffectation de service', resource: 'session de travail' }
        ];

        const permissionRepository = this.connection.getRepository(Permission);
        for (const permissionData of shiftPermissions) {
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
