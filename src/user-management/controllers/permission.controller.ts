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
  Req
} from '@nestjs/common';
import { PermissionService } from '../services/permission/permission.service';
import { Permission } from '../entities/permission.entity';
import { UpdateResult } from 'typeorm';
import { Permissions, Public } from '../decorators/auth.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('permissions')
@Controller('api/permissions')
@ApiBearerAuth()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) { }

  /* private readonly permissionPermissions = [
    { name: 'view-permissions', label: 'View all permissions' },
    { name: 'create-permission', label: 'Create a new permission' },
    { name: 'view-permission', label: 'View a specific permission' },
    { name: 'update-permission', label: 'Update an existing permission' },
    { name: 'delete-permission', label: 'Delete a permission' },
    { name: 'restore-permission', label: 'Restore a deleted permission' },
  ]; */

  @Get()
  @Permissions('view-permissions')
  @ApiOperation({ summary: 'Get all permissions' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('relations') relations?: string[],
    @Query('sort') sort?: string,
    @Query('withDeleted') withDeleted?: boolean,
    @Query('onlyDeleted') onlyDeleted?: boolean,
    @Query('select') select?: string[],
    @Query() query?: any,
  ): Promise<{
    data: Permission[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.permissionService.findAll(
      page,
      limit,
      relations,
      sort,
      withDeleted,
      onlyDeleted,
      select,
      query
    );
  }

  @Post()
  @Permissions('create-permission')
  @ApiOperation({ summary: 'Create a new permission' })
  async create(
    @Body() permission: Permission,
  ): Promise<Partial<Permission>> {
    return this.permissionService.create(permission);
  }

  @Get(':id')
  @Permissions('view-permission')
  @ApiOperation({ summary: 'Get a specific permission' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('withDeleted') withDeleted?: boolean,
  ): Promise<any> {
    return this.permissionService.findOrThrow(id, [], withDeleted);
  }

  @Put(':id')
  @Permissions('update-permission')
  @ApiOperation({ summary: 'Update an existing permission' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() permission: Permission,
  ): Promise<UpdateResult> {
    return this.permissionService.update(id, permission);
  }

  @Delete(':id')
  @Permissions('delete-permission')
  @ApiOperation({ summary: 'Delete a permission' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.permissionService.findOrThrow(id);
    const roles = await this.permissionService.findRolesWithPermission(id);
    if (roles.length > 0) {
      throw new ConflictException(
        'Cannot delete permission as it is assigned to roles',
      );
    }
    this.permissionService.softDelete(id);
  }

  @Patch(':id/restore')
  @Permissions('restore-permission')
  @ApiOperation({ summary: 'Restore a deleted permission' })
  async restore(@Param('id', ParseIntPipe) id: number): Promise<UpdateResult> {
    const permission = await this.permissionService.findOrThrow(id, [], true);
    if (permission.deletedAt) {
      return this.permissionService.restore(id);
    }
    throw new ConflictException('Permission is not deleted');
  }

  @Get('group-by-resource')
  @Public()
  @ApiOperation({ summary: 'Get all permissions grouped by resource' })
  async findAllPermissionsGroupByResource(@Req() req: Request) {
    return this.permissionService.findAndGroupPermissionsWithUserAccess(req);
  }
}
