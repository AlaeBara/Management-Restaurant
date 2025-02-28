import { Body, ConflictException, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Role } from '../entities/role.entity';
import { RoleService } from '../services/role/role.service';
import { CreateRoleDto } from '../dto/role/create.dto';
import { UpdateRoleDto } from '../dto/role/update.dto';
import { PermissionService } from '../services/permission/permission.service';
import { Permissions, Roles } from '../decorators/auth.decorator';

@ApiTags('roles')
@Controller('api/roles')
@ApiBearerAuth()
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly PermissionService: PermissionService,
  ) { }

  @Get()
  @Permissions('view-role')
  @ApiOperation({ summary: 'Get all roles' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('relations') relations?: string[],
    @Query('sort') sort?: string,
    @Query('withDeleted') withDeleted?: boolean,
    @Query('onlyDeleted') onlyDeleted?: boolean,
    @Query('select') select?: string[],
    @Query() query?: any,
  ): Promise<{ data: Role[]; total: number; page: number; limit: number }> {
    const roles = await this.roleService.findAll(
      page,
      limit,
      relations,
      sort,
      withDeleted,
      onlyDeleted,
      select,
      query
    );
    roles.data = roles.data.filter(role => role.name !== 'superadmin');
    return roles;
  }

  @Post()
  @Permissions('manage-role')
  @ApiOperation({ summary: 'Create a new role' })
  async create(
    @Body() role: CreateRoleDto,
  ) {
    await this.roleService.toLowerCase(role);
    if (role.name === 'superadmin') {
      throw new UnauthorizedException('Le rôle superadmin ne peut pas être créé');
    }
    await this.roleService.throwIfFoundByName(role.name);
    await this.roleService.create(role);
    return { message: 'Super! Le rôle a été créé avec succès', status: 201 };
  }

  @Get(':id')
  @Permissions('view-role')
  @ApiOperation({ summary: 'Get a specific role' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('relations') relations?: string[],
    @Query('withDeleted') withDeleted?: boolean,
  ): Promise<Role> {
    return this.roleService.findOrThrow(id, relations, withDeleted);
  }

  @Put(':id')
  @Permissions('update-role')
  @ApiOperation({ summary: 'Update an existing role' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() role: UpdateRoleDto,
  ) {
    await this.roleService.updateRole(id, role);
    return { message: 'Super! Le rôle a été modifié avec succès', status: 200 };
  }

  @Delete(':id')
  @Permissions('manage-role')
  @ApiOperation({ summary: 'Delete a role' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    const role = await this.roleService.findOrThrow(id);
    if (role.name === 'superadmin') {
      throw new UnauthorizedException('Le rôle superadmin ne peut pas être supprimé');
    }
    await this.roleService.validateRoleIsNotInUse(id);
    await this.roleService.softDelete(id);
    return { message: 'Super! Le rôle a été supprimé avec succès', status: 200 };
  }

  @Patch(':id/restore')
  @Permissions('manage-role')
  @ApiOperation({ summary: 'Restore a deleted role' })
  async restore(@Param('id', ParseIntPipe) id: number) {
    const role = await this.roleService.findOrThrow(id, [], true);
    if (role.deletedAt) {
      await this.roleService.restore(id);
      return { message: 'Super! Le rôle a été restauré avec succès', status: 200 };
    }
    throw new ConflictException('Le rôle n\'est pas supprimé');
  }

  @Get(':id/permissions')
  @Permissions('view-role-permission')
  @ApiOperation({ summary: 'Get permissions for a specific role' })
  async getPermissionsByRoleId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    await this.roleService.findOrThrow(id);
    return this.roleService.getPermissionsByRoleId(id);
  }

  @Post(':id/permissions/:permissionId')
  @Roles('superadmin', 'admin')
  @Permissions('manage-role-permission')
  @ApiOperation({ summary: 'Grant a permission to a role' })
  async grantPermissionToRole(
    @Param('id', ParseIntPipe) id: number,
    @Param('permissionId', ParseIntPipe) permissionId: number,
  ): Promise<any> {
    const role = await this.roleService.findOrThrow(id, ['permissions']);
    const permission = await this.PermissionService.findOrThrow(permissionId);
    await this.roleService.grantPermissionToRole(role, permission);
    return { message: 'Super! La permission a été attribuée au rôle avec succès', status: 200 };
  }

  @Delete(':id/permissions/:permissionId')
  @Roles('superadmin', 'admin')
  @Permissions('manage-role-permission')
  @ApiOperation({ summary: 'Revoke a permission from a role' })
  async revokePermissionFromRole(
    @Param('id', ParseIntPipe) id: number,
    @Param('permissionId', ParseIntPipe) permissionId: number,
  ): Promise<any> {
    const role = await this.roleService.findOrThrow(id, ['permissions']);
    const permission = await this.PermissionService.findOrThrow(permissionId);
    await this.roleService.revokePermissionFromRole(role, permission);
    return { message: 'Super! La permission a été révoquée du rôle avec succès', status: 200 };
  }

  @Get(':id/permissions/group-by-resource')
  @Permissions('view-role-permission')
  @ApiOperation({ summary: 'Get permissions for a specific role grouped by resource' })
  async findAndGroupPermissionsWithRoleAccess(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const role = await this.roleService.findOrThrow(id, ['permissions']);
    return await this.roleService.findAndGroupPermissionsWithRoleAccess(role);
  }
}
