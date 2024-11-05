import { BadRequestException, forwardRef, Inject, Injectable, Req } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { hash } from 'argon2';
import { GenericService } from 'src/common/services/generic.service';
import { CreateUserDto } from 'src/user-management/dto/user/create-user.dto';
import { UpdateUsernameDto } from 'src/user-management/dto/user/update-username.dto';
import { Role } from 'src/user-management/entities/role.entity';
import { User } from 'src/user-management/entities/user.entity';
import { UserStatus } from 'src/user-management/enums/user-status.enum';
import { DataSource, Repository } from 'typeorm';
import { RoleService } from '../role/role.service';
import { UpdateUserDto } from 'src/user-management/dto/user/update-user.dto';

@Injectable()
export class UserService extends GenericService<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => RoleService))
    private roleService: RoleService,
    @InjectDataSource() dataSource: DataSource,
    @InjectDataSource() private dataSourceprivate: DataSource,
  ) {
    super(dataSource, User, 'user');
  }

  async create(createUserDto: CreateUserDto) {

    await this.validateUnique({
      username: createUserDto.username,
      email: createUserDto.email,
      phone: createUserDto.phone,
    });

    createUserDto.password = await hash(createUserDto.password)
    const user = this.userRepository.create(createUserDto);
    user.roles = [];

    if (createUserDto.roleId == null) {
      return this.userRepository.save(user);
    }

    const role = await this.roleService.findOneByIdWithOptions(createUserDto.roleId);
    await this.grantRoleToUser(user, role);

    return user;
  }

  // TODO : let user can have only one role
  async grantRoleToUser(user: User, role: Role) {
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
        'New username is the same as the current username',
      );
    }

    const userByUsername = await this.findByAttributes({
      username: updateUsernameDto.username.toLowerCase(),
    });
    if (userByUsername && userByUsername.id !== user.id) {
      throw new BadRequestException('Username already exists');
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
    const role = await this.roleService.findOneByIdWithOptions(roleId);
    await this.grantRoleToUser(user, role);
  }
  async updatePasswordByUser(user: User, password: string) {
    user.password = await hash(password);
  }

  updateStatusByUser(user: User, status: UserStatus) {
    if (user.status === status) {

      return;
    }
    if (status === UserStatus.DELETED) {
      throw new BadRequestException('User cannot be deleted');
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
    if (Object.keys(userToUpdate).length === 0) {
      throw new BadRequestException('No update fields provided');
    }
    // Find user by ID with roles relation
    const user = await this.findOneByIdWithOptions(id, { relations: ['roles'] });

    // Destructure update fields from DTO
    const { status, username, email, phone, password, roleId, ...remainingUpdates } = userToUpdate;

    // Update user status if provided
    if (status || status !== undefined) {
      await this.updateStatusByUser(user, status)
    }

    // Update username if provided
    if (username != null) {
      await this.updateUsernameByUser(user, userToUpdate);
    }

    // Update email if provided
    if (email != null) {
      await this.updateEmailByUser(user, email);
    }

    // Update phone if provided 
    if (phone != null) {
      await this.updatePhoneByUser(user, phone);
    }

    // Update password if provided
    if (password != null) {
      await this.updatePasswordByUser(user, password);
    }

    // Update role if provided
    if (roleId != null) {
      await this.updateRoleByUser(user, roleId);
    }

    const updatedUser = Object.assign(user, remainingUpdates);
    return this.userRepository.save(updatedUser);
  }


}
