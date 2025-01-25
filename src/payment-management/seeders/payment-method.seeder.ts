// src/database/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { PaymentMethod } from '../entities/payment-method.entity';
import { PaymentMethodEnum } from '../enums/payment-method.enum';

@Injectable()
export class PaymentMethodSeeder {
    constructor(private readonly connection: Connection) { }

    async seed() {
        await this.seedPaymentMethodsData();
        console.log('Payment Method Seeding completed!');
    }

    private async seedPaymentMethodsData() {
        const paymentMethodRepository = this.connection.getRepository(PaymentMethod);

        for (const paymentMethod of Object.values(PaymentMethodEnum)) {
            const existingPaymentMethod = await paymentMethodRepository.findOne({
                where: { name: paymentMethod },
                withDeleted: true
            });

            if (!existingPaymentMethod) {
                const paymentObject = paymentMethodRepository.create({ name: paymentMethod, protected: true });
                await paymentMethodRepository.save(paymentObject);
            }
        }
    }
}
