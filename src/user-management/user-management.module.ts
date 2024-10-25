import { Module } from '@nestjs/common';
import { RoleService } from './services/role/role.service';
import { UserService } from './services/user/user.service';
import { PermissionService } from './services/permission/permission.service';
import { UserController } from './controllers/user.controller';
import { CommonModule } from 'src/common/common.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationController } from './controllers/authentication.controller';
import { AuthenticationService } from './services/authentication/authentication.service';
import { User } from './entity/user.entity';
import { Role } from './entity/role.entity';
import { Permission } from './entity/permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './controllers/role.controller';
import { PermissionController } from './controllers/permission.controller';

import {
  permissionGenericServiceFactory,
  roleGenericServiceFactory,
  userGenericServiceFactory,
} from './services/generic-factories';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([User, Role, Permission]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [
    UserController,
    AuthenticationController,
    RoleController,
    PermissionController,
  ],
  providers: [
    RoleService,
    UserService,
    PermissionService,
    AuthenticationService,
   /*  {
      provide: 'ROLE_GENERIC_SERVICE',
      useFactory: roleGenericServiceFactory,
      inject: [DataSource],
    },
    {
      provide: 'PERMISSION_GENERIC_SERVICE',
      useFactory: permissionGenericServiceFactory,
      inject: [DataSource],
    },
    {
      provide: 'USER_GENERIC_SERVICE',
      useFactory: userGenericServiceFactory,
      inject: [DataSource],
    }, */
  ],
})
export class UserManagementModule {}
