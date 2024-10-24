import { Module } from '@nestjs/common';
import { UserManagementModule } from './user-management/user-management.module';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user-management/entity/user.entity';
import { Role } from './user-management/entity/role.entity';
import { Permission } from './user-management/entity/permission.entity';

@Module({
  imports: [
    UserManagementModule,
    CommonModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: "localhost",
      port: 5434,
      username: "local_restaurant",
      password: "local_restaurant",
      database: "local_restaurant",
      entities: [User, Role, Permission],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
