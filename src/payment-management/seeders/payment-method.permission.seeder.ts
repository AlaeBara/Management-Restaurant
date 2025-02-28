// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Permission } from '../../user-management/entities/permission.entity';

@Injectable()
export class PaymentMethodPermissionSeeder {
  constructor(private readonly connection: Connection) { }

  async seed() {
    await this.seedPaymentMethodPermissions();
    console.log('Payment Method Permission Seeding completed!');
  }

  private async seedPaymentMethodPermissions() {

    const paymentMethodPermissions = [
      { name: 'view-payment-method', label: 'Voir un mode de paiement', resource: 'payment-method' },
      { name: 'manage-payment-method', label: 'Gérer un mode de paiement (créer, modifier, supprimer)', resource: 'payment-method' },
    ];

    const permissionRepository = this.connection.getRepository(Permission);
    //await permissionRepository.save(rolePermissions);
    for (const permissionData of paymentMethodPermissions) {
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
