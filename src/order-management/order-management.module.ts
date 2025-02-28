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
import { OrderPublicController } from './controllers/public/order.public.controller';
import { OrderPublicService } from './services/public/order.public.service';
import { OrderEmitterEvent } from './emitter/order.emitter';
import { OrderEventService } from './services/event/order.event.service';
import { OutboxModule } from 'src/outbox-module/outbox.module';
import { OrderAction } from './entities/order-action.entity';
import { OrderActionService } from './services/order-action.service';
import { OrderStatusController } from './controllers/orderStatus.controller';
import { OrderStatusService } from './services/order-status.service';
import { OrderItemChoicesService } from './services/order-item-choices.service';
import { OrderPermissionSeeder } from './seeders/order-permission.seeder';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Guest,
      OrderStatusHistory,
      OrderPayment,
      OrderAction
    ]),
    forwardRef(() => PaymentModule),
    forwardRef(() => ProductManagementModule),
    forwardRef(() => UserManagementModule),
    forwardRef(() => ZoneTableModule),
    forwardRef(() => MenuItemModule),
    forwardRef(() => ClientManagementModule),
    forwardRef(() => InventoryModule),
    forwardRef(() => OutboxModule)
  ],
  controllers: [
    GuestController,
    OrderController,
    OrderPublicController,
    OrderStatusController
  ],
  providers: [
    GuestService,
    OrderService,
    OrderItemService,
    OrderPublicService,
    OrderActionService,
    OrderEmitterEvent,
    OrderEventService,
    OrderStatusService,
    OrderItemChoicesService,
    OrderPermissionSeeder
  ],
  exports: [
    OrderPermissionSeeder
  ],
})

export class OrderManagementModule { }
