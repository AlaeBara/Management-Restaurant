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
import { Constants } from '../common/constants/contanst';

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
  ],
})
export class UserManagementModule {}
