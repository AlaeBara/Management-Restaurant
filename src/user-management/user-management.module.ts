import { forwardRef, Module } from '@nestjs/common';

import { RoleService } from './services/role/role.service';
import { UserService } from './services/user/user.service';
import { PermissionService } from './services/permission/permission.service';
import { UserController } from './controllers/user.controller';
import { AuthenticationController } from './controllers/authentication.controller';
import { AuthenticationService } from './services/authentication/authentication.service';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './controllers/role.controller';
import { PermissionController } from './controllers/permission.controller';
import { AccessRolePermissionSeeder } from './seeders/access-role-permission.seeder';
import { UserPermissionSeeder } from './seeders/user-permission.seeder';
import { RolePermissionSeeder } from './seeders/role-permission.seeder';
import { PermissionPermissionsSeeder } from './seeders/permission-permissions.seeder';
import { RolesSeeder } from './seeders/role.seeder';
import { PermissionsGuard } from './guards/permission.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import UserProfileController from './controllers/user-profile.controller';
import UserStatusController from './controllers/user-status.controller';
import UserVerificationController from './controllers/user-verification.controller';
import { UserStatusService } from './services/user/user-status.service';
import SendVerificationEmailController from './controllers/send-verification-email.controller';
import { UserActionToken } from './entities/user-action-token.entity';
import { EmailVerificationService } from './services/authentication/email-verification.service';
import { MediaLibraryModule } from 'src/media-library-management/media-library.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission, UserActionToken]),
    forwardRef(() => MediaLibraryModule)
  ],
  controllers: [
    UserController,
    UserProfileController,
    AuthenticationController,
    RoleController,
    PermissionController,
    UserStatusController,
    UserProfileController,
    UserVerificationController,
    SendVerificationEmailController,
  ],
  providers: [
    RoleService,
    UserService,
    PermissionService,
    PermissionsGuard,
    RolesGuard,
    JwtAuthGuard,
    AuthenticationService,
    AccessRolePermissionSeeder,
    RolePermissionSeeder,
    UserPermissionSeeder,
    PermissionPermissionsSeeder,
    RolesSeeder,
    UserStatusService,
    EmailVerificationService,
  ],
  exports: [
    AccessRolePermissionSeeder,
    PermissionPermissionsSeeder,
    RolePermissionSeeder,
    RolesSeeder,
    UserPermissionSeeder,
    RoleService,
    UserService,
  ],
})

export class UserManagementModule { }
