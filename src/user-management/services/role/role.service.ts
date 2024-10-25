import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { GenericService } from 'src/common/services/generic.service';
import { Permission } from 'src/user-management/entity/permission.entity';
import { Role } from 'src/user-management/entity/role.entity';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class RoleService extends GenericService<Role> {
  constructor(
    @InjectDataSource() dataSource: DataSource,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {
    super(dataSource, Role, 'role');
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

  async grantPermissionToRole(roleId: number, permissionId: number) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });

    role.permissions.push(permission);
    await this.roleRepository.save(role);
  }
}
