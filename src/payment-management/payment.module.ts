import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentMethod } from './entities/payment-method.entity';
import { PaymentMethodService } from './services/payment-method.service';
import { PaymentMethodController } from './controllers/payment-method.controller';
import { PaymentMethodSeeder } from './seeders/payment-method.seeder';
import { PaymentMethodPermissionSeeder } from './seeders/payment-method.permission.seeder';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentMethod])
  ],
  controllers: [PaymentMethodController],
  providers: [
    PaymentMethodService,
    PaymentMethodSeeder,
    PaymentMethodPermissionSeeder
  ],
  exports: [
    PaymentMethodSeeder,
    PaymentMethodPermissionSeeder
  ],
})

export class PaymentModule { }
