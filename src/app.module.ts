import { Module } from '@nestjs/common';
import { UserManagementModule } from './user-management/user-management.module';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from './user-management/guards/jwt.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './user-management/guards/roles.guard';
import { PermissionsGuard } from './user-management/guards/permission.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { ZoneTableModule } from './zone-table-management/zone-table.module';
import { ClientManagementModule } from './client-management/client-management.module';
import { UnitModule } from './unit-management/unit.module';
import { SupplierModule } from './supplier-management/supplier.module';
import { StorageModule } from './storage-management/storage.module';
import { ProductManagementModule } from './product-management/product.module';
import { InventoryModule } from './inventory-managemet/inventory.module';
import { FundModule } from './fund-management/fund.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes env variables available throughout the app
      //envFilePath: '.env',
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
    CommonModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: 587, // Add explicit port
        secure: true, // Add secure option for TLS
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false // Add this for development
        }
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
  },],
  exports: [],
})
export class AppModule { }
