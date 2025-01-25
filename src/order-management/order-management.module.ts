import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentModule } from 'src/payment-management/payment.module';
import { ProductManagementModule } from 'src/product-management/product.module';
import { UserManagementModule } from 'src/user-management/user-management.module';
import { ZoneTableModule } from 'src/zone-table-management/zone-table.module';

@Module({
  imports: [TypeOrmModule.forFeature([]),
    forwardRef(() => PaymentModule),
    forwardRef(() => ProductManagementModule),
    forwardRef(() => UserManagementModule),
    forwardRef(() => ZoneTableModule),
  ],
  controllers: [],
  providers: [],
  exports: [],
})

export class OrderManagementModule {}
