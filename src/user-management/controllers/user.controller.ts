import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Query,
  Put,
} from '@nestjs/common';

import { CreateUserDto } from '../dto/user/create-user.dto';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { UserService } from '../services/user/user.service';
import { User } from '../entity/user.entity';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) { }


  /* private readonly userPermissions = [
    { permission: 'view-users', label: 'View all users' },
    { permission: 'create-user', label: 'Create a new user' },
    { permission: 'view-user', label: 'View a specific user' },
    { permission: 'update-user', label: 'Update an existing user' },
    { permission: 'delete-user', label: 'Delete a user' },
    { permission: 'restore-user', label: 'Restore a deleted user' },
  ]; */


  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('relations') relations?: string[],
    @Query('sort') sort?: string,
  ): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    return this.userService.findAll(page, limit, relations, sort);
  }

  @Post()
  async create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<any> {
    await this.userService.throwIfFoundByAnyAttribute({
      username: createUserDto.username,
      email: createUserDto.email,
    });
    const user = await this.userService.create(createUserDto);
    return user;
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOrThrow(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(+id);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.userService.restore(+id);
  }
}
