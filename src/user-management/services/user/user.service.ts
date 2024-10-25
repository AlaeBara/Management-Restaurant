import { Inject, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { hash } from 'argon2';
import { GenericService } from 'src/common/services/generic.service';
import { CreateUserDto } from 'src/user-management/dto/user/create-user.dto';
import { UpdateUserDto } from 'src/user-management/dto/user/update-user.dto';
import { User } from 'src/user-management/entity/user.entity';
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
    return this.userRepository.save(newUser);
  }
}
