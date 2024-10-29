import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Put,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';

import { CreateUserDto } from '../dto/user/create-user.dto';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { UserService } from '../services/user/user.service';
import { User } from '../entities/user.entity';
import { Permissions } from '../decorators/auth.decorator';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RoleService } from '../services/role/role.service';
import { RolesGuard } from '../guards/roles.guard';
import { PermissionsGuard } from '../guards/permission.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('api/users')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService
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
  @Permissions('view-users')
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('relations') relations?: string[],
    @Query('sort') sort?: string,
  ): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    return this.userService.findAll(page, limit, relations, sort);
  }

  @Post()
  @Permissions('create-user')
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<any> {
    await this.userService.throwIfFoundByAnyAttribute({
      username: createUserDto.username,
      email: createUserDto.email,
    }, [], true);
    const user = await this.userService.create(createUserDto);
    return user;
  }

  @Get(':id')
  @Permissions('view-user')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOrThrow(id);
  }

  @Put(':id')
  @Permissions('update-user')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(+id, updateUserDto);
  }

  @Post(':id/roles/:roleid')
  @Permissions('grant-user-role')
  async grantRoleToUser(
    @Param('id', ParseIntPipe) id: number,
    @Param('roleid', ParseIntPipe) roleid: number,
  ) {
    const user = await this.userService.findOrThrow(id, ['roles']);
    const role = await this.roleService.findOrThrow(roleid);
    this.userService.grantRoleToUser(user, role);
  }
}
