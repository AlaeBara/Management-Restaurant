import { BadRequestException, ConflictException, Injectable, Req } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { request } from 'express';
import { GenericService } from 'src/common/services/generic.service';
import { User } from 'src/user-management/entities/user.entity';
import { UserStatus } from 'src/user-management/enums/user-status.enum';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserStatusService extends GenericService<User> {
  constructor(
    @InjectDataSource() dataSource: DataSource,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super(dataSource, User, 'user');
  }

  async isBlocked(user: User) {
    return user.isBlocked;
  }

  async checkSelf(user: User, @Req() request: Request) {
    if (user.id === request['user'].sub) {
      throw new BadRequestException(
        'You cannot do this action to self-account',
      );
    }
  }

  async markAsDeleted(user: User, @Req() request: Request) {
    const originalStatus = user.status;
    const originalIsBlocked = user.isBlocked;
    try {
      if (user.status === UserStatus.DELETED) {
        throw new BadRequestException('User is already deleted');
      }
      if (user.roles.some((role) => role.name === 'superadmin')) {
        throw new BadRequestException('Super admin cannot be deleted');
      }
      await this.checkSelf(user, request);
      const updateResult = await this.userRepository.update(user.id, {
        status: UserStatus.DELETED,
        isBlocked: true
      });

      if (!updateResult.affected) {
        throw new Error('Update failed');
      }

      return await this.softDelete(user.id);
    } catch (error) {
      if (error.message !== 'User is already deleted' &&
        error.message !== 'Super admin cannot be deleted') {
        await this.userRepository.update(user.id, {
          status: originalStatus,
          isBlocked: originalIsBlocked
        });
      }
      throw new ConflictException('Problem while deleting user:' + error.message);
    }
  }

  async markAsRestored(id: number) {
    try {
      await this.findOneByIdWithOptions(id, { select: 'status,isBlocked', onlyDeleted: true });
  
      let updateResult = await this.update(id, { status: UserStatus.ACTIVE, isBlocked: false });
      if (!updateResult.affected) {
        throw new ConflictException('Problem while restoring user');
      }
    
      return await this.restoreByUUID(id, true, ['username', 'email', 'phone']);
    } catch (error) {
      await this.update(id, { status: UserStatus.DELETED, isBlocked: true });
      throw new ConflictException('Problem while restoring user: ' + error.message);
    }
  }

  async markAs(user: User, status: UserStatus, @Req() request: Request) {
    if (user.status === status) {
      throw new BadRequestException('User is already ' + status.valueOf());
    }
    if (status === UserStatus.DELETED) {
      throw new BadRequestException('User cannot be deleted');
    }
    await this.checkSelf(user, request);
    user.status = status;
    if (!this.isBlocked(user)) {
      user.isBlocked = true;
    }
    if (status === UserStatus.ACTIVE) {
      user.isBlocked = false;
    }
    return this.userRepository.save(user);
  }
}
