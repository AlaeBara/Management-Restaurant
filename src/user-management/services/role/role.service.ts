import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/user-management/entity/permission.entity';
import { Role } from 'src/user-management/entity/role.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  create(role: Role): Promise<Role> {
    return this.roleRepository.save(role);
  }

  update(id: number, role: Role): Promise<UpdateResult> {
    return this.roleRepository.update(id, role);
  }

  findOne(id: number): Promise<Role> {
    return this.roleRepository.findOne({ where: { id } });
  }

  delete(id: number): Promise<DeleteResult> {
    return this.roleRepository.softDelete(id);
  }

  restore(id: number): Promise<UpdateResult> {
    return this.roleRepository.restore(id);
  }

  async getPermissionsByRoleId(roleId: number) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
    if (!role) {
      throw new Error('Role not found');
    }

    const permissions = role.permissions.map((permission) => permission.name);
    return permissions;
  }

  async attachPermissionToRole(roleId: number, permissionId: number) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    role.permissions.push(permission);
    await this.roleRepository.save(role);
  }
}
