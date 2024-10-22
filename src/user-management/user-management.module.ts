import { Module } from '@nestjs/common';
import { RoleService } from './services/role/role.service';
import { UserService } from './services/user/user.service';
import { PermissionService } from './services/permission/permission.service';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [RoleService, UserService, PermissionService]
})
export class UserManagementModule {}
