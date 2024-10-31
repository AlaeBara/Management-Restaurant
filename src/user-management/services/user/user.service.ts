import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { hash } from 'argon2';
import { GenericService } from 'src/common/services/generic.service';
import { CreateUserDto } from 'src/user-management/dto/user/create-user.dto';
import { UpdateUsernameDto } from 'src/user-management/dto/user/update-username.dto';
import { Role } from 'src/user-management/entities/role.entity';
import { User } from 'src/user-management/entities/user.entity';
import { UserStatus } from 'src/user-management/enums/user-status.enum';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserService extends GenericService<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectDataSource() dataSource: DataSource,
  ) {
    super(dataSource, User, 'user');
  }

  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto;
    const hashedPassword = await hash(password);
    const newUser = this.userRepository.create({
      password: hashedPassword,
      ...user,
    });
    newUser.status = UserStatus.EMAIL_UNVERIFIED;
    return this.userRepository.save(newUser);
  }

  // TODO : let user can have only one role
  async grantRoleToUser(user: User, role: Role) {
    console.log(user);
    user.roles.push(role);
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
}
