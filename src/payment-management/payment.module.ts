import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentMethod } from './entities/payment-method.entity';
import { PaymentMethodService } from './services/payment-method.service';
import { PaymentMethodController } from './controllers/payment-method.controller';
import { PaymentMethodSeeder } from './seeders/payment-method.seeder';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentMethod])
  ],
  controllers: [PaymentMethodController],
  providers: [PaymentMethodService, PaymentMethodSeeder],
  exports: [PaymentMethodSeeder],
})

export class PaymentModule { }
