// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Role } from '../entities/role.entity';

@Injectable()
export class RolesSeeder {
  constructor(private readonly connection: Connection) { }

  async seed() {
    await this.seedUsers();
    console.log('Role Permission Seeding completed!');
  }

  private async seedUsers() {


    const rolePermissions = [
      { name: 'superadmin', label: 'Accès et contrôle complet du système' },
      { name: 'admin', label: 'Accès administratif et gestion' },
      { name: 'manager', label: 'Supervision et rapports départementaux' },
      { name: 'controller', label: 'Contrôle financier et audit' },
      { name: 'serveur', label: 'Service de table et gestion des commandes' },
      { name: 'chef', label: 'Gestion de cuisine et préparation des aliments' },
      { name: 'sous-chef', label: 'Gestion de cuisine assistante' },
      { name: 'barman', label: 'Service de boissons et gestion du bar' },
      { name: 'caissier', label: 'Manipulation de l\'argent et traitement des paiements' },
    ];

    const roleRepository = this.connection.getRepository(Role);
    //await roleRepository.save(rolePermissions);

    for (const permissionData of rolePermissions) {
        const existingPermission = await roleRepository.findOne({
            where: { name: permissionData.name },
            withDeleted: true
        });

        if (!existingPermission) {
            await roleRepository.save(permissionData);
        }
    }
  }
}
