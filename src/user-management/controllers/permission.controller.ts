import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put } from '@nestjs/common';
import { PermissionService } from '../services/permission/permission.service';
import { Permission } from '../entity/permission.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('api/permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  async findAll(): Promise<Permission[]> {
    return this.permissionService.findAll();
  }

  @Post()
  async create(@Body() permission: Permission): Promise<Permission> {
    return this.permissionService.create(permission);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<any> {
      return this.permissionService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() permission: Permission,
  ): Promise<UpdateResult> {
    return this.permissionService.update(id, permission);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.permissionService.delete(id);
  }

  @Patch(':id/restore')
  async restore(@Param('id') id: number): Promise<UpdateResult> {
    return this.permissionService.restore(id);
  }
}
