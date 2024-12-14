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

  /*  async checkSelf(user: User, @Req() request: Request) {
     if (user.id === request['user'].sub) {
       throw new BadRequestException(
         'You cannot do this action to self-account',
       );
     }
   } */

  async markAsDeleted(user: User, @Req() request: Request) {
    const originalStatus = user.status;
    const originalIsBlocked = user.isBlocked;
    try {
      if (user.status === UserStatus.DELETED) {
        throw new BadRequestException('L\'utilisateur est déjà supprimé');
      }
      if (user.roles.some((role) => role.name === 'superadmin')) {
        throw new BadRequestException('Le super administrateur ne peut pas être supprimé');
      }
      if (await this.checkSelf(user, request)) {
        throw new BadRequestException('Vous ne pouvez pas effectuer cette action sur votre propre compte');
      }
      const updateResult = await this.userRepository.update(user.id, {
        status: UserStatus.DELETED,
        isBlocked: true
      });

      if (!updateResult.affected) {
        throw new BadRequestException('La mise à jour a échoué');
      }

      return await this.softDelete(user.id);
    } catch (error) {
      if (error.message !== 'L\'utilisateur est déjà supprimé' &&
        error.message !== 'Le super administrateur ne peut pas être supprimé') {
        await this.userRepository.update(user.id, {
          status: originalStatus,
          isBlocked: originalIsBlocked
        });
      }
      throw new ConflictException('Problème lors de la suppression de l\'utilisateur:' + error.message);
    }
  }

  async markAsRestored(id: number) {
    try {
      await this.findOneByIdWithOptions(id, { select: 'status,isBlocked', onlyDeleted: true });

      let updateResult = await this.update(id, { status: UserStatus.ACTIVE, isBlocked: false });
      if (!updateResult.affected) {
        throw new ConflictException('Problème lors de la restauration de l\'utilisateur');
      }

      return await this.restoreByUUID(id, true, ['username', 'email', 'phone']);
    } catch (error) {
      await this.update(id, { status: UserStatus.DELETED, isBlocked: true });
      throw new ConflictException('Problème lors de la restauration de l\'utilisateur: ' + error.message);
    }
  }

  async markAs(user: User, status: UserStatus, @Req() request: Request) {
    if (user.status === status) {
      throw new BadRequestException('L\'utilisateur est déjà ' + status.valueOf());
    }
    if (status === UserStatus.DELETED) {
      throw new BadRequestException('L\'utilisateur ne peut pas être supprimé');
    }
    if (await this.checkSelf(user, request)) {
      throw new BadRequestException('Vous ne pouvez pas effectuer cette action sur votre propre compte');
    }
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
