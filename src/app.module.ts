import { Module } from '@nestjs/common';
import { UserManagementModule } from './user-management/user-management.module';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user-management/entity/user.entity';
import { Role } from './user-management/entity/role.entity';
import { Permission } from './user-management/entity/permission.entity';
import { JwtModule } from '@nestjs/jwt';
import { Constants } from './common/constants/contanst';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes env variables available throughout the app
      //envFilePath: '.env',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.jwt_secret,
      signOptions: { expiresIn: '1h' },
    }),
    UserManagementModule,
    CommonModule,
    TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        //entities: [User, Role, Permission],
        autoLoadEntities: true,
        synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
