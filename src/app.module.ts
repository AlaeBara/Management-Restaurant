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
    ZoneTableModule,
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
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
  ],
  controllers: [],
  providers: [ {
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
export class AppModule {}
