import { Module } from '@nestjs/common';
import { RoleService } from './services/role/role.service';
import { UserService } from './services/user/user.service';
import { PermissionService } from './services/permission/permission.service';
import { UserController } from './controllers/user.controller';
import { CommonModule } from 'src/common/common.module';
import { AuthenticationController } from './controllers/authentication.controller';
import { AuthenticationService } from './services/authentication/authentication.service';
import { User } from './entity/user.entity';
import { Role } from './entity/role.entity';
import { Permission } from './entity/permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './controllers/role.controller';
import { PermissionController } from './controllers/permission.controller';
import { AccessRolePermissionSeeder } from './seeders/access-role-permission.seeder';
import { UserPermissionSeeder } from './seeders/user-permission.seeder';
import { RolePermissionSeeder } from './seeders/role-permission.seeder';
import { PermissionPermissionsSeeder } from './seeders/permission-permissions.seeder';
import { RolesSeeder } from './seeders/role.seeder';
import { MasterSeeder } from './seeders/master.seeder';
import { PermissionsGuard } from './guards/permission.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import UserProfileController from './controllers/user-profile.controller';
import UserStatusController from './controllers/user-status.controller';
import UserVerificationController from './controllers/user-verification.controller';
import { UserStatusService } from './services/user/user-status.service';
import SendVerificationEmailController from './controllers/send-verification-email.controller';
import { UserActionToken } from './entity/user-action-token.entity';
import { EmailVerificationService } from './services/authentication/email-verification.service';


@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([User, Role, Permission, UserActionToken])
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
    SendVerificationEmailController
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
    MasterSeeder,
    UserStatusService,
    EmailVerificationService
  ],
  exports: [MasterSeeder],
})
export class UserManagementModule {}
