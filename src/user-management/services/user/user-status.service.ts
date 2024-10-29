import { BadRequestException, Injectable, Req } from '@nestjs/common';
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
      throw new BadRequestException('You cannot do this action to self-account');
    }
  }

  async markAsBlocked(user: User, @Req() request: Request) {
    if (user.isBlocked || user.status === UserStatus.SUSPENDED) {
      throw new BadRequestException('User already blocked');
    }
    await this.checkSelf(user, request);
    user.isBlocked = true;
    user.status = UserStatus.SUSPENDED;
    return this.userRepository.save(user);
  }

  

  async markAsDeleted(user: User, @Req() request: Request) {
    if (user.status === UserStatus.DELETED) {
      throw new BadRequestException('User is already deleted');
    }
    await this.checkSelf(user, request);

    if (request['user'].roles.includes('superadmin')) {
      throw new BadRequestException('Super admin cannot be deleted');
    }
    user.status = UserStatus.DELETED;
    if(!this.isBlocked(user)){
      user.isBlocked = true;
    }
    await this.userRepository.softDelete(user.id);
    return this.userRepository.save(user);
  }

  async markAsRestored(id: number) {
    await this.userRepository.restore(id);
    const user = await this.findOrThrow(id);
    user.status = UserStatus.ACTIVE;
    user.isBlocked = false;
    return this.userRepository.save(user);
  }

  async markAsArchived(user: User, @Req() request: Request) {
    if (user.status === UserStatus.ARCHIVED) {
      throw new BadRequestException('User is already archived');
    }
    await this.checkSelf(user, request);
    user.status = UserStatus.ARCHIVED;
    if(!this.isBlocked(user)){
      user.isBlocked = true;
    }
    return this.userRepository.save(user);
  }

  async markAsInactive(user: User, @Req() request: Request) {
    if (user.status === UserStatus.INACTIVE) {
      throw new BadRequestException('User is already inactive');
    }
    await this.checkSelf(user, request);
    user.status = UserStatus.INACTIVE;
    if(!this.isBlocked(user)){
      user.isBlocked = true;
    }
    return this.userRepository.save(user);
  }

  async markAsBanned(user: User, @Req() request: Request) {
    if (user.status === UserStatus.BANNED) {
      throw new BadRequestException('User is already banned');
    }
    await this.checkSelf(user, request);  
    user.status = UserStatus.BANNED;
    if(!this.isBlocked(user)){
      user.isBlocked = true;
    }
    return this.userRepository.save(user);
  }

  async markAsEmailUnverified(user: User, @Req() request: Request) {
    if (user.status === UserStatus.EMAIL_UNVERIFIED) {
      throw new BadRequestException('User is already email unverified');
    }
    await this.checkSelf(user, request);
    user.status = UserStatus.EMAIL_UNVERIFIED;
    if(!this.isBlocked(user)){
      user.isBlocked = true;
    }
    return this.userRepository.save(user);
  }

  async markAsActive(user: User, @Req() request: Request) {
    if (user.status === UserStatus.ACTIVE) {
      throw new BadRequestException('User is already active');
    }
    await this.checkSelf(user, request);
    user.status = UserStatus.ACTIVE;
    if(this.isBlocked(user)){
      user.isBlocked = false;
    }
    return this.userRepository.save(user);
  }
}
