import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailerModule } from '@nestjs-modules/mailer';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';

import { UserManagementModule } from './user-management/user-management.module';
import { CommonModule } from './common/common.module';
import { JwtAuthGuard } from './user-management/guards/jwt.guard';
import { RolesGuard } from './user-management/guards/roles.guard';
import { PermissionsGuard } from './user-management/guards/permission.guard';
import { ZoneTableModule } from './zone-table-management/zone-table.module';
import { ClientManagementModule } from './client-management/client-management.module';
import { UnitModule } from './unit-management/unit.module';
import { SupplierModule } from './supplier-management/supplier.module';
import { StorageModule } from './storage-management/storage.module';
import { ProductManagementModule } from './product-management/product.module';
import { InventoryModule } from './inventory-managemet/inventory.module';
import { FundModule } from './fund-management/fund.module';
import { ShiftZoneModule } from './shift-zone-management/shift-zone.module';
import { PurchaseManagementModule } from './purchase-management/purchase-management.module';
import { LanguageModule } from './language-management/language.module';
import { CategoryModule } from './category-management/category.module';
import { MenuItemModule } from './menu-item-management/menu-item.module';
import { UploadModule } from './upload-management/upload.module';
import { MediaLibraryModule } from './media-library-management/media-library.module';
import { PaymentModule } from './payment-management/payment.module';
import { OrderManagementModule } from './order-management/order-management.module';
import { OutboxModule } from './outbox-module/outbox.module';
import { OutboxListener } from './outbox-module/listeners/outbox.listener';
import { OutboxListenerFactory } from './outbox-module/listeners/outbox.listener.factory';
import { SentryCatchAllExceptionFilter } from './common/sentry/sentry.catch';

@Module({
  imports: [
    SentryModule.forRoot(),
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.jwt_secret,
      signOptions: { expiresIn: '1day' },
    }),
    UserManagementModule,
    ClientManagementModule,
    UnitModule,
    ZoneTableModule,
    SupplierModule,
    StorageModule,
    ProductManagementModule,
    InventoryModule,
    FundModule,
    ShiftZoneModule,
    PurchaseManagementModule,
    CommonModule,
    LanguageModule,
    CategoryModule,
    MenuItemModule,
    UploadModule,
    MediaLibraryModule,
    PaymentModule,
    OrderManagementModule,
    OutboxModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME_TEST,
      autoLoadEntities: true,
      synchronize: true,
      subscribers: [
        OutboxListener,
      ],
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: true,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
  ],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
  {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },
  {
    provide: APP_GUARD,
    useClass: PermissionsGuard,
  },
  {
    provide: APP_FILTER,
    useClass: SentryGlobalFilter,
  },
  {
    provide: APP_FILTER,
    useClass: SentryCatchAllExceptionFilter,
  },
  ],
  exports: [],
})

export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly outboxListenerFactory: OutboxListenerFactory) { }

  async onApplicationBootstrap() {
    this.outboxListenerFactory.create();
  }
}