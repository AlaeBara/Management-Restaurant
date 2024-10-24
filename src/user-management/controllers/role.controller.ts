import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { Role } from '../entity/role.entity';
import { RoleService } from '../services/role/role.service';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('api/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async findAll(): Promise<Role[]> {
    return this.roleService.findAll();
  }

  @Post()
  async create(@Body() role: Role): Promise<Role> {
    return this.roleService.create(role);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Role> {
    return this.roleService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() role: Role,
  ): Promise<UpdateResult> {
    return this.roleService.update(id, role);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.roleService.delete(id);
  }

  @Patch(':id/restore')
  async restore(@Param('id') id: number): Promise<UpdateResult> {
    return this.roleService.restore(id);
  }

  @Get(':id/permissions')
  async getPermissionsByRoleId(@Param('id') id: number): Promise<any> {
    return this.roleService.getPermissionsByRoleId(id);
  }

  @Post(':id/permissions/:permissionId')
  async attachPermissionToRole(
    @Param('id') id: number,
    @Param('permissionId') permissionId: number,
  ): Promise<any> {
    return await this.roleService.attachPermissionToRole(id, permissionId);
  }
}
