import { DataSource } from 'typeorm';
import { GenericService } from 'src/common/services/generic.service';
import { Role } from '../entity/role.entity';
import { Permission } from '../entity/permission.entity';
import { User } from '../entity/user.entity';

export const roleGenericServiceFactory = (dataSource: DataSource) => {
  return new GenericService<Role>(dataSource, Role, 'role');
};

export const permissionGenericServiceFactory = (dataSource: DataSource) => {
  return new GenericService<Permission>(dataSource, Permission, 'permission');
};

export const userGenericServiceFactory = (dataSource: DataSource) => {
  return new GenericService<User>(dataSource, User, 'user');
};
