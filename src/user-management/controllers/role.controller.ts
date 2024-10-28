import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Role } from '../entity/role.entity';
import { RoleService } from '../services/role/role.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateRoleDto } from '../dto/role/create.dto';
import { UpdateRoleDto } from '../dto/role/update.dto';
import { PermissionService } from '../services/permission/permission.service';
import { Permissions } from '../decorators/auth.decorator';

@Controller('api/roles')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly PermissionService: PermissionService,
  ) {}

  /* private readonly rolePermissions = [
    { permission: 'view-roles', label: 'View all roles' },
    { permission: 'create-role', label: 'Create a new role' },
    { permission: 'view-role', label: 'View a specific role' },
    { permission: 'update-role', label: 'Update an existing role' },
    { permission: 'delete-role', label: 'Delete a role' },
    { permission: 'restore-role', label: 'Restore a deleted role' },
    { permission: 'view-role-permissions', label: 'View permissions for a role' },
    { permission: 'grant-role-permission', label: 'Grant a permission to a role' },
  ]; */

  @Get()
  @Permissions('view-roles')
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('relations') relations?: string[],
    @Query('sort') sort?: string,
  ): Promise<{ data: Role[]; total: number; page: number; limit: number }> {
    return this.roleService.findAll(page, limit, relations, sort);
  }

  @Post()
  @Permissions('create-role')
  async create(
    @Body(new ValidationPipe()) role: CreateRoleDto,
  ): Promise<Partial<Role>> {
    await this.roleService.toLowerCase(role);
    if (role.name === 'superadmin') {
      throw new UnauthorizedException('Role superadmin cannot be created');
    }
    await this.roleService.throwIfFoundByName(role.name);
    return this.roleService.create(role);
  }

  @Get(':id')
  @Permissions('view-role')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return this.roleService.findOrThrow(id);
  }

  @Put(':id')
  @Permissions('update-role')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) role: UpdateRoleDto,
  ): Promise<UpdateResult> {
    await this.roleService.toLowerCase(role);
    if (role.name === 'superadmin') {
      throw new UnauthorizedException('Role superadmin cannot be updated');
    }
    await this.roleService.findOrThrow(id);
    return this.roleService.update(id, role);
  }

  @Delete(':id')
  @Permissions('delete-role')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.roleService.delete(id);
  }

  @Patch(':id/restore')
  @Permissions('restore-role')
  async restore(@Param('id', ParseIntPipe) id: number): Promise<UpdateResult> {
    return this.roleService.restore(id);
  }

  @Get(':id/permissions')
  @Permissions('view-role-permissions')
  async getPermissionsByRoleId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    await this.roleService.findOrThrow(id);
    return this.roleService.getPermissionsByRoleId(id);
  }

  @Post(':id/permissions/:permissionId')
  @Permissions('grant-role-permission')
  async grantPermissionToRole(
    @Param('id', ParseIntPipe) id: number,
    @Param('permissionId', ParseIntPipe) permissionId: number,
  ): Promise<any> {
    const role = await this.roleService.findOrThrow(id, ['permissions']);
    const permission = await this.PermissionService.findOrThrow(permissionId);
    return await this.roleService.grantPermissionToRole(role, permission);
  }
}
