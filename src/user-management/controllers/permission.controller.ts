import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { PermissionService } from '../services/permission/permission.service';
import { Permission } from '../entity/permission.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('api/permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  async findAll(): Promise<{
    data: Permission[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.permissionService.findAll();
  }

  @Post()
  async create(
    @Body(new ValidationPipe()) permission: Permission,
  ): Promise<Partial<Permission>> {
    return this.permissionService.create(permission);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<any> {
    return this.permissionService.findOrThrow(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body(new ValidationPipe()) permission: Permission,
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
