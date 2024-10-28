import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Query,
  Put,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';

import { CreateUserDto } from '../dto/user/create-user.dto';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { UserService } from '../services/user/user.service';
import { User } from '../entity/user.entity';
import { Permissions } from '../decorators/auth.decorator';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { Roles } from '../decorators/auth.decorator';
import { RoleService } from '../services/role/role.service';
import { RolesGuard } from '../guards/roles.guard';
import { PermissionsGuard } from '../guards/permission.guard';

@Controller('api/users')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  /* private readonly userPermissions = [
    { permission: 'view-users', label: 'View all users' },
    { permission: 'create-user', label: 'Create a new user' },
    { permission: 'view-user', label: 'View a specific user' },
    { permission: 'update-user', label: 'Update an existing user' },
    { permission: 'delete-user', label: 'Delete a user' },
    { permission: 'restore-user', label: 'Restore a deleted user' },
    { permission: 'grant-user-role', label: 'Accorder un rôle à un utilisateur' },
  ]; */

  @Get()
  @Permissions('public-access')
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('relations') relations?: string[],
    @Query('sort') sort?: string,
  ): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    return this.userService.findAll(page, limit, relations, sort);
  }

  @Post()
  @Roles('chef')
  async create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<any> {
    await this.userService.throwIfFoundByAnyAttribute({
      username: createUserDto.username,
      email: createUserDto.email,
    });
    const user = await this.userService.create(createUserDto);
    return user;
  }

  @Get(':id')
  @Roles('chef')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOrThrow(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(+id);
  }

  @Patch(':id/restore')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.userService.restore(+id);
  }

  @Post(':id/roles/:roleid')
  @Permissions('grant-role-permission')
  async grantRoleToUser(
    @Param('id', ParseIntPipe) id: number,
    @Param('roleid', ParseIntPipe) roleid: number,
  ) {
    const user = await this.userService.findOrThrow(id, ['roles']);
    const role = await this.roleService.findOrThrow(roleid);
    this.userService.grantRoleToUser(user, role);
  }
}
