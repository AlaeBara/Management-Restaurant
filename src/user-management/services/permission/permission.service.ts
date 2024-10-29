import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, UpdateResult, DataSource } from 'typeorm';
import { Permission } from '../../entities/permission.entity';
import { GenericService } from 'src/common/services/generic.service';
import { Role } from 'src/user-management/entities/role.entity';

@Injectable()
export class PermissionService extends GenericService<Permission> {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectDataSource() dataSource: DataSource,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {
    super(dataSource, Permission, 'permission');
  }

  async findRolesWithPermission(permissionId: number): Promise<Role[]> {
    return this.roleRepository.find({
      where: { permissions: { id: permissionId } },
      relations: ['permissions'],
    });
  }
}
