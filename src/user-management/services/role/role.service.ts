import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { GenericService } from 'src/common/services/generic.service';
import { CreateRoleDto } from 'src/user-management/dto/role/create.dto';
import { Permission } from 'src/user-management/entity/permission.entity';
import { Role } from 'src/user-management/entity/role.entity';
import { User } from 'src/user-management/entity/user.entity';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class RoleService extends GenericService<Role> {
  constructor(
    @InjectDataSource() dataSource: DataSource,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

  async grantPermissionToRole(role: Role, permission: Permission) {

    if (permission.name === 'access-granted') {
      throw new UnauthorizedException('Permission access-granted cannot be granted to a role');
    }

    role.permissions.push(permission);
    await this.roleRepository.save(role);
  }

  async toLowerCase(role: CreateRoleDto) {
    role.name = role.name.toLowerCase();
  }

  async validateRoleIsNotInUse(roleId: number): Promise<void> {
    const usersWithRole = await this.userRepository
      .createQueryBuilder('users')
      .leftJoin('users.roles', 'role')
      .where('role.id = :roleId', { roleId })
      .andWhere('users.id IS NOT NULL')
      .andWhere('users.deletedAt IS NULL')  // Only check active users
      .getCount();
  
    if (usersWithRole > 0) {
      throw new ConflictException('Cannot delete role as it is assigned to active users');
    }
  }
}
