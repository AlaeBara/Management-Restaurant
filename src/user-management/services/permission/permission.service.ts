import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  DeleteResult,
  UpdateResult,
  DataSource,
  In,
} from 'typeorm';
import { Permission } from '../../entities/permission.entity';
import { GenericService } from 'src/common/services/generic.service';
import { Role } from 'src/user-management/entities/role.entity';
import { User } from 'src/user-management/entities/user.entity';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable()
export class PermissionService extends GenericService<Permission> {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectDataSource() dataSource: DataSource,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @Inject(forwardRef(() => AuthenticationService))
    private authenetication: AuthenticationService,
  ) {
    super(dataSource, Permission, 'permission');
  }

  async findRolesWithPermission(permissionId: number): Promise<Role[]> {
    return this.roleRepository.find({
      where: { permissions: { id: permissionId } },
      relations: ['permissions'],
    });
  }

  /* async findAllPermissionsGroupByResource() {
    return this.permissionRepository.createQueryBuilder('permission')
      .select('permission.resource', 'resource')
      .addSelect('permission.id', 'id')
      .addSelect('permission.name', 'name')
      .addSelect('permission.label', 'label')
      .orderBy('permission.resource', 'ASC')
      .orderBy('permission.name', 'ASC')
      .getRawMany()
      .then(permissions => {
        // Group permissions by resource
        return permissions.reduce((groups, permission) => {
          const resource = permission.resource;
          if (!groups[resource]) {
            groups[resource] = [];
          }
          groups[resource].push({
            id: permission.id,
            name: permission.name,
            label: permission.label
          });
          return groups;
        }, {});
      });
  } */

  async findAndGroupPermissionsWithUserAccess(@Req() req: Request) {
    const user = await this.authenetication.findUserByEmailOrUsername(
      req['user'].email,
    );
    const userPermissionIds = user.roles[0].permissions.map((p) => p.id);

    return this.permissionRepository
      .createQueryBuilder('permission')
      .select('permission.resource', 'resource')
      .addSelect('permission.id', 'id')
      .addSelect('permission.name', 'name')
      .addSelect('permission.label', 'label')
      .orderBy('permission.resource', 'ASC')
      .orderBy('permission.name', 'ASC')
      .getRawMany()
      .then((permissions) => {
        // Group permissions by resource
        return permissions.reduce((groups, permission) => {
          const resource = permission.resource;
          if (!groups[resource]) {
            groups[resource] = [];
          }
          groups[resource].push({
            id: permission.id,
            name: permission.name,
            label: permission.label,
            currentUserHasPermission:
              user.roles[0].name === 'superadmin'
                ? true
                : userPermissionIds.includes(permission.id),
          });
          return groups;
        }, {});
      });
  }
}
