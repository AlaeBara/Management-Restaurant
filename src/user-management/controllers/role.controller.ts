import {
  Body,
  ConflictException,
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
} from '@nestjs/common';
import { Role } from '../entities/role.entity';
import { RoleService } from '../services/role/role.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateRoleDto } from '../dto/role/create.dto';
import { UpdateRoleDto } from '../dto/role/update.dto';
import { PermissionService } from '../services/permission/permission.service';
import { Permissions, Roles } from '../decorators/auth.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags('roles')
@Controller('api/roles')
@ApiBearerAuth()
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
  @ApiOperation({ summary: 'Get all roles' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('relations') relations?: string[],
    @Query('sort') sort?: string,
    @Query('withDeleted') withDeleted?: boolean,
    @Query('onlyDeleted') onlyDeleted?: boolean,
    @Query('select') select?: string[],
  ): Promise<{ data: Role[]; total: number; page: number; limit: number }> {
    return this.roleService.findAll(
      page,
      limit,
      relations,
      sort,
      withDeleted,
      onlyDeleted,
      select,
    );
  }

  @Post()
  @Permissions('create-role')
  @ApiOperation({ summary: 'Create a new role' })
  async create(
    @Body() role: CreateRoleDto,
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
  @ApiOperation({ summary: 'Delete a role' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    const role = await this.roleService.findOrThrow(id);
    if (role.name === 'superadmin') {
      throw new UnauthorizedException('Role superadmin cannot be deleted');
    }
    await this.roleService.validateRoleIsNotInUse(id);
    return this.roleService.softDelete(id);
  }

  @Patch(':id/restore')
  @Permissions('restore-role')
  @ApiOperation({ summary: 'Restore a deleted role' })
  async restore(@Param('id', ParseIntPipe) id: number): Promise<UpdateResult> {
    const role = await this.roleService.findOrThrow(id,[],true);
    if(role.deletedAt){
      return this.roleService.restore(id);
    }
    throw new ConflictException('Role is not deleted');
  }
  
  @Get(':id/permissions')
  @Permissions('view-role-permissions')
  @ApiOperation({ summary: 'Get permissions for a specific role' })
  async getPermissionsByRoleId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    await this.roleService.findOrThrow(id);
    return this.roleService.getPermissionsByRoleId(id);
  }

  @Post(':id/permissions/:permissionId')
  @Roles('superadmin','admin')
  @Permissions('grant-role-permission')
  @ApiOperation({ summary: 'Grant a permission to a role' })
  async grantPermissionToRole(
    @Param('id', ParseIntPipe) id: number,
    @Param('permissionId', ParseIntPipe) permissionId: number,
  ): Promise<any> {
    const role = await this.roleService.findOrThrow(id, ['permissions']);
    const permission = await this.PermissionService.findOrThrow(permissionId);
    return await this.roleService.grantPermissionToRole(role, permission);
  }

  @Delete(':id/permissions/:permissionId')
  @Roles('superadmin','admin')
  @Permissions('revoke-role-permission')
  @ApiOperation({ summary: 'Revoke a permission from a role' })
  async revokePermissionFromRole(
    @Param('id', ParseIntPipe) id: number,
    @Param('permissionId', ParseIntPipe) permissionId: number,
  ): Promise<any> {
    const role = await this.roleService.findOrThrow(id, ['permissions']);
    const permission = await this.PermissionService.findOrThrow(permissionId);
    return await this.roleService.revokePermissionFromRole(role, permission);
  }

  @Get(':id/permissions/group-by-resource')
  @Permissions('view-role-permissions')
  @ApiOperation({ summary: 'Get permissions for a specific role grouped by resource' })
  async findAndGroupPermissionsWithRoleAccess(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const role = await this.roleService.findOrThrow(id, ['permissions']);
    return this.roleService.findAndGroupPermissionsWithRoleAccess(role);
  }
}
