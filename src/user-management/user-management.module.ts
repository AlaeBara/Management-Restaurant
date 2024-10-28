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
import { AuthGuard } from './guards/auth.guard';
import { AccessRolePermissionSeeder } from './seeders/access-role-permission.seeder';
import { UserPermissionSeeder } from './seeders/user-permission.seeder';
import { RolePermissionSeeder } from './seeders/role-permission.seeder';
import { PermissionPermissionsSeeder } from './seeders/permission-permissions.seeder';
import { RolesSeeder } from './seeders/role.seeder';
import { MasterSeeder } from './seeders/master.seeder';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([User, Role, Permission]),
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
    AuthGuard,
    AuthenticationService,
    AccessRolePermissionSeeder,
    RolePermissionSeeder,
    UserPermissionSeeder,
    PermissionPermissionsSeeder,
    RolesSeeder,
    MasterSeeder
  ],
  exports: [MasterSeeder],
})
export class UserManagementModule {}
