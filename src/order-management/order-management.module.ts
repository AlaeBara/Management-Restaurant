import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MenuItemModule } from 'src/menu-item-management/menu-item.module';
import { PaymentModule } from 'src/payment-management/payment.module';
import { ProductManagementModule } from 'src/product-management/product.module';
import { UserManagementModule } from 'src/user-management/user-management.module';
import { ZoneTableModule } from 'src/zone-table-management/zone-table.module';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { Guest } from './entities/guest.entity';
import { GuestController } from './controllers/guest.controller';
import { GuestService } from './services/guest.service';
import { OrderStatusHistory } from './entities/order-status-history.entity';
import { OrderPayment } from './entities/order-payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
    Order,
    OrderItem,
    Guest,
    OrderStatusHistory,
    OrderPayment]),
  forwardRef(() => PaymentModule),
  forwardRef(() => ProductManagementModule),
  forwardRef(() => UserManagementModule),
  forwardRef(() => ZoneTableModule),
  forwardRef(() => MenuItemModule),
  ],
  controllers: [GuestController],
  providers: [GuestService],
  exports: [],
})

export class OrderManagementModule { }
