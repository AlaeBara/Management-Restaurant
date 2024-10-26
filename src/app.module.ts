import { Module } from '@nestjs/common';
import { UserManagementModule } from './user-management/user-management.module';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user-management/entity/user.entity';
import { Role } from './user-management/entity/role.entity';
import { Permission } from './user-management/entity/permission.entity';
import { JwtModule } from '@nestjs/jwt';
import { Constants } from './common/constants/contanst';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: Constants.jwt_secret,
      signOptions: { expiresIn: '1h' },
    }),
    UserManagementModule,
    CommonModule,
    TypeOrmModule.forRoot({
        type: 'postgres',
        host: Constants.DB_HOST,
        port: Constants.DB_PORT,
        username: Constants.DB_USERNAME,
        password: Constants.DB_PASSWORD,
        database: Constants.DB_NAME,
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
