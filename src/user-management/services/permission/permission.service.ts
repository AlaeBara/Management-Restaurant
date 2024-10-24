import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { Permission } from '../../entity/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async findAll(): Promise<Permission[]> {
    return await this.permissionRepository.find();
  }

  create(permission: Permission): Promise<Permission> {
    return this.permissionRepository.save(permission);
  }

  update(id: number, permission: Permission): Promise<UpdateResult> {
    return this.permissionRepository.update(id, permission);
  }

  async findOne(id: number): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return permission;
  }

  delete(id: number): Promise<DeleteResult> {
    return this.permissionRepository.softDelete(id);
  }

  restore(id: number): Promise<UpdateResult> {
    return this.permissionRepository.restore(id);
  }
}
