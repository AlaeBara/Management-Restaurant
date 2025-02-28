import { Controller, Get, Post, Body, Patch, Param, Query, Put, UseGuards, ParseIntPipe, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from '../dto/user/create-user.dto';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { UserService } from '../services/user/user.service';
import { User } from '../entities/user.entity';
import { Permissions } from '../decorators/auth.decorator';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RoleService } from '../services/role/role.service';
import { RolesGuard } from '../guards/roles.guard';
import { PermissionsGuard } from '../guards/permission.guard';

@ApiTags('users')
@Controller('api/users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService
  ) { }

  @Get()
  @Permissions('view-user')
  @ApiOperation({ summary: 'Get all users' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('relations') relations?: string[],
    @Query('sort') sort?: string,
    @Query('withDeleted') withDeleted?: boolean,
    @Query('onlyDeleted') onlyDeleted?: boolean,
    @Query('select') select?: string[],
    @Query() query?: any,
  ): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    return this.userService.findAll(
      page,
      limit,
      relations,
      sort,
      withDeleted,
      onlyDeleted,
      select,
      query
    );
  }

  @Post()
  @Permissions('manage-user')
  @ApiOperation({ summary: 'Create a new user' })
  @UseInterceptors(FileInterceptor('avatar'))
  async create(@Body() createUserDto: CreateUserDto, @UploadedFile() file: Express.Multer.File, @Req() request: Request): Promise<any> {
    //await this.userService.throwIfFoundByAnyAttribute({ username: createUserDto.username, email: createUserDto.email }, [], true);
    const data = {
      ...createUserDto,
      profilePicture: file
    }
    await this.userService.createUser(data, request);
    return { message: 'Super! Le compte utilisateur a été créé avec succès', status: 200 };
  }

  @Get(':id')
  @Permissions('view-user')
  @ApiOperation({ summary: 'Get a specific user' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('relations') relations?: string[],
    @Query('withDeleted') withDeleted?: boolean,
  ) {
    return this.userService.findOrThrow(id, relations, withDeleted);
  }

  @Put(':id')
  @Permissions('manage-user')
  @ApiOperation({ summary: 'Update an existing user' })
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ) {
    // return await this.userService.update(+id, updateUserDto);
    const userData = {
      ...updateUserDto,
      ...(file && { avatar: file })
    };
    await this.userService.updateUser(id, userData, request);
    return { message: 'Super! Le compte utilisateur a été modifié avec succès', status: 200 };
  }

  @Post(':id/roles/:roleid')
  @Permissions('manage-user')
  @ApiOperation({ summary: 'Grant a role to a user' })
  async grantRoleToUser(
    @Param('id', ParseIntPipe) id: number,
    @Param('roleid', ParseIntPipe) roleid: number,
  ) {
    const user = await this.userService.findOrThrow(id, ['roles']);
    this.userService.grantRoleToUser(user, roleid);
    return { message: 'Super! Le rôle a été attribué avec succès à l\'utilisateur', status: 200 };
  }
}
