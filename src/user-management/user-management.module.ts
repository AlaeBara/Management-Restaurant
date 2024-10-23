import { Module } from '@nestjs/common';
import { RoleService } from './services/role/role.service';
import { UserService } from './services/user/user.service';
import { PermissionService } from './services/permission/permission.service';
import { UserController } from './controllers/user.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { CommonModule } from 'src/common/common.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationController } from './controllers/authentication.controller';
import { AuthenticationService } from './services/authentication/authentication.service';

@Module({
  imports: [PrismaModule,CommonModule,JwtModule.register({ global: true, secret: process.env.JWT_SECRET ,signOptions: { expiresIn: '1h' } })],
  controllers: [UserController, AuthenticationController],
  providers: [RoleService, UserService, PermissionService, AuthenticationService]
})
export class UserManagementModule {}
