import { BadRequestException, forwardRef, Inject, Injectable, Req } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { hash, verify } from 'argon2';
import { GenericService } from 'src/common/services/generic.service';
import { CreateUserDto } from 'src/user-management/dto/user/create-user.dto';
import { UpdateUsernameDto } from 'src/user-management/dto/user/update-username.dto';
import { Role } from 'src/user-management/entities/role.entity';
import { User } from 'src/user-management/entities/user.entity';
import { UserStatus } from 'src/user-management/enums/user-status.enum';
import { DataSource, Repository } from 'typeorm';
import { RoleService } from '../role/role.service';
import { UpdateUserDto } from 'src/user-management/dto/user/update-user.dto';
import { UpdatePasswordDto } from 'src/user-management/dto/user/update-password.dto';
import { MediaLibraryService } from 'src/media-library-management/services/media-library.service';

@Injectable()
export class UserService extends GenericService<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => RoleService))
    private roleService: RoleService,
    @InjectDataSource() dataSource: DataSource,
    @Inject(forwardRef(() => MediaLibraryService))
    private mediaLibraryService: MediaLibraryService,
  ) {
    super(dataSource, User, 'user');
  }

  async inizializeQueryRunner() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return queryRunner;
  }

  /**
   * Create a new user
   * @param createUserDto The user data to be created
   * @returns The created user
   */
  async createUser(createUserDto: CreateUserDto, @Req() request: Request) {
    // Validate if user with same username, email or phone already exists
    await this.validateUnique({
      username: createUserDto.username,
      email: createUserDto.email,
      phone: createUserDto.phone,
    });

    // Hash the password before creating user
    createUserDto.password = await hash(createUserDto.password)

    // Create a new user instance
    const user = await this.userRepository.create(createUserDto);

    // Handle user status if provided
    const status = createUserDto.status
    if (status || status !== undefined) {
      await this.updateStatusByUser(user, status)
    }

    // Return early if no role ID is provided
    if (createUserDto.roleId == null) {
      return this.userRepository.save(user);
    }

    // Handle avatar
    if (createUserDto.profilePicture) {
      const avatar = await this.mediaLibraryService.iniMediaLibrary(createUserDto.profilePicture, 'profiles', request['user'].sub);
      user.avatar = avatar;
    }

    user.roles = [];
    await this.grantRoleToUser(user, createUserDto.roleId);

    return user;
  }


  // TODO : let user can have only one role
  async grantRoleToUser(user: User, roleId: number) {
    const role = await this.roleService.findOneByIdWithOptions(roleId);
    if (user.roles.length > 0) {
      user.roles[0] = role;
    } else {
      user.roles.push(role);
    }
    return this.userRepository.save(user);
  }

  async toLowerCase(user: User) {
    user.username = user.username.toLowerCase();
  }

  async updateUsername(id: number, updateUsernameDto: UpdateUsernameDto) {
    const user = await this.findOrThrow(id, [], true);

    // Check if the new username is the same as the current one
    if (user.username === updateUsernameDto.username.toLowerCase()) {
      throw new BadRequestException(
        'Le nouveau nom d\'utilisateur est le même que le nom d\'utilisateur actuel',
      );
    }

    const userByUsername = await this.findByAttributes({
      username: updateUsernameDto.username.toLowerCase(),
    });
    if (userByUsername && userByUsername.id !== user.id) {
      throw new BadRequestException('Le nom d\'utilisateur existe déjà');
    }

    user.username = updateUsernameDto.username.toLowerCase();
    return this.userRepository.save(user);
  }

  async checkSelf(user: User, @Req() request: Request) {
    return user.id === request['user'].sub;
  }

  async updateUsernameByUser(user: User, updateUsernameDto: UpdateUsernameDto) {
    await this.validateUniqueExcludingSelf({
      username: updateUsernameDto.username.toLowerCase(),
    }, user.id);

    user.username = updateUsernameDto.username.toLowerCase();
  }

  async updateEmailByUser(user: User, email: string) {
    await this.validateUniqueExcludingSelf({
      email: email,
    }, user.id);

    user.email = email;
  }

  async updatePhoneByUser(user: User, phone: string) {
    await this.validateUniqueExcludingSelf({
      phone: phone,
    }, user.id);

    user.phone = phone;
  }

  async updateRoleByUser(user: User, roleId: number) {
    await this.grantRoleToUser(user, roleId);
  }

  async updatePasswordByUser(user: User, password: string) {
    user.password = await hash(password);
  }

  async updateStatusByUser(user: User, status: UserStatus) {
    if (user.status === status) {
      return;
    }


    if (status === UserStatus.DELETED) {
      // u cant pass deleted on update status (only done automaticly on delete action)
      throw new BadRequestException('L\'utilisateur ne peut pas être supprimé');
    }

    user.status = status;

    if (!user.isBlocked) {
      user.isBlocked = true;
    }

    if (status === UserStatus.ACTIVE) {
      user.isBlocked = false;
      user.isEmailVerified = true;
      user.emailVerifiedAt = new Date();
    }
  }

  /**
   * Updates a user's information
   * @param id - The ID of the user to update
   * @param userToUpdate - The DTO containing the user fields to update
   * @param request - The request object
   * @returns The updated user
   */
  async updateUser(id: number, userToUpdate: UpdateUserDto, @Req() request: Request) {
    const queryRunner = await this.inizializeQueryRunner();
    if (Object.keys(userToUpdate).length === 0) {
      throw new BadRequestException('Aucun champ à mettre à jour');
    }
    // Find user by ID with roles relation
    const user = await this.findOneByIdWithOptions(id, { relations: ['roles', 'avatar'] });

    // Update user status if provided
    if (userToUpdate.status || userToUpdate.status !== undefined) {
      await this.updateStatusByUser(user, userToUpdate.status)
    }

    // Update username if provided
    if (userToUpdate.username || userToUpdate.username !== undefined) {
      await this.updateUsernameByUser(user, userToUpdate);
    }

    // Update email if provided
    if (userToUpdate.email || userToUpdate.email !== undefined) {
      await this.updateEmailByUser(user, userToUpdate.email);
    }

    // Update phone if provided 
    if (userToUpdate.phone || userToUpdate.phone !== undefined) {
      await this.updatePhoneByUser(user, userToUpdate.phone);
    }

    // Update password if provided
    if (userToUpdate.password || userToUpdate.password !== undefined) {
      await this.updatePasswordByUser(user, userToUpdate.password);
    }

    // Update role if provided
    if (userToUpdate.roleId || userToUpdate.roleId !== undefined) {
      await this.updateRoleByUser(user, userToUpdate.roleId);
    }

    try {
      // Handle update avatar
      if (userToUpdate.avatar && !userToUpdate.setAvatarAsNull) {
        if (user.avatar) {
          await this.mediaLibraryService.deleteMediaLibrary(user.avatar.id, queryRunner);
        }

        const newAvatar = await this.mediaLibraryService.iniMediaLibrary(
          userToUpdate.avatar,
          'profiles',
          request['user'].sub
        );

        user.avatar = newAvatar; 
      }
      
      if (userToUpdate.setAvatarAsNull) {
        if (user.avatar) {
          await this.mediaLibraryService.deleteMediaLibrary(user.avatar.id, queryRunner);
        }
        user.avatar = null;
      }

      const { avatar, setAvatarAsNull, ...updateFields } = userToUpdate;
      const updatedUser = Object.assign(user, updateFields);
      
      const savedUser = await queryRunner.manager.save(User, updatedUser);
      await queryRunner.commitTransaction();

      return savedUser;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updatePasswordByProfile(@Req() request: Request, updatePasswordDto: UpdatePasswordDto) {
    const reqUser = request['user'];
    const user = await this.findOneByIdWithOptions(reqUser.sub, { select: 'password' });
    const oldPassword = updatePasswordDto.oldPassword;
    const newPassword = updatePasswordDto.newPassword;
    const confirmPassword = updatePasswordDto.confirmPassword;

    if (oldPassword === newPassword) {
      throw new BadRequestException('Le nouveau mot de passe est le même que l\'ancien mot de passe');
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Le nouveau mot de passe et le mot de passe de confirmation ne correspondent pas');
    }

    if (!(await verify(user.password, oldPassword))) {
      throw new BadRequestException('L\'ancien mot de passe est incorrect');
    }

    user.password = await hash(newPassword);
    return this.userRepository.save(user);
  }

  async findUserByRequest(request: Request) {
    const reqUser = request['user'] ? request['user'] : null;
    return reqUser ? this.userRepository.findOne({ where: { id: reqUser.sub } }) : null;
  }
}
