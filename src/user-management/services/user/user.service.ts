import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { hash } from 'argon2';
import { PrismaService } from 'prisma/prisma.service';
import { BaseService } from 'src/common/services/base.service';
import { CreateUserDto } from 'src/user-management/dto/create-user.dto';
import { UpdateUserDto } from 'src/user-management/dto/update-user.dto';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(prisma: PrismaService) {
    super(prisma, 'user');
  }

  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto;
    const hashedPassword = await hash(password);
    return await this.prisma.user.create({
      data: {
        password: hashedPassword,
        ...user,
      },
    });
  }

  findAll() {
    return super.findAll();
  }

  findOne(conditions: Record<string, any>) {
    return super.findOne(conditions);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
