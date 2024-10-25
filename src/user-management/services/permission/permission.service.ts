import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, UpdateResult, DataSource } from 'typeorm';
import { Permission } from '../../entity/permission.entity';
import { GenericService } from 'src/common/services/generic.service';

@Injectable()
export class PermissionService extends GenericService<Permission> {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(dataSource, Permission, 'permission');
  }
}
