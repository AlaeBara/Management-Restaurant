import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'argon2';
import { CreateUserDto } from 'src/user-management/dto/user/create-user.dto';
import { UpdateUserDto } from 'src/user-management/dto/user/update-user.dto';
import { User } from 'src/user-management/entity/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserService  {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto;
    const hashedPassword = await hash(password);
    const newUser = this.userRepository.create({
      password: hashedPassword,
      ...user,
    });
    return await this.userRepository.save(newUser);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.softDelete(id);
  }

  restore(id: number) {
    return this.userRepository.restore(id);
  }
}
