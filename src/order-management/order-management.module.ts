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
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';
import { OrderItemService } from './services/order-item.service';
import { ClientManagementModule } from 'src/client-management/client-management.module';
import { InventoryModule } from 'src/inventory-managemet/inventory.module';

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
  forwardRef(() => ClientManagementModule),
  forwardRef(() => InventoryModule),
  ],
  controllers: [GuestController, OrderController],
  providers: [

    GuestService,
    OrderService,
    OrderItemService,
  ],
  exports: [],
})

export class OrderManagementModule { }
