import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { Permissions, Roles } from '../decorators/auth.decorator';
import { UserService } from '../services/user/user.service';
import { ApiTags } from '@nestjs/swagger';
import { NumericType } from 'typeorm';
import { UpdateUsernameDto } from '../dto/user/update-username.dto';

@ApiTags('users/profile')
@Controller('api/users/profile')
export default class UserProfileController {
  constructor(private userService: UserService) {}
  //public async updateEmail(req: Request, res: Response) // in progress
  //public async updateUsernameById(@Param('id', ParseIntPipe) id: number,@Body(new ValidationPipe()) updateUsernameDto: UpdateUsernameDto,) // done
  //async updateUsernameByUser( @Req() request: Request,@Body(new ValidationPipe()) updateUsernameDto: UpdateUsernameDto,) // done
  //public async updatePassword(req: Request, res: Response) // in progress
  //async profile(@Req() request: Request) // done


  @Patch(':id/username')
  @Roles('superadmin')
  @Permissions('update-user-username')
  async updateUsernameById(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateUsernameDto: UpdateUsernameDto,
  ) {
    await this.userService.updateUsername(id, updateUsernameDto);
    return { message: 'Username updated successfully', status: 200 };
  }

  @Patch('username')
  @Permissions('update-user-username')
  async updateUsernameByUser(
    @Req() request: Request,
    @Body(new ValidationPipe()) updateUsernameDto: UpdateUsernameDto,
  ) {
    const reqUser = request['user'];
    // Update the username for the authenticated user
    await this.userService.updateUsername(reqUser.sub, updateUsernameDto);
    return { message: 'Username updated successfully', status: 200 };
  }

  @Get()
  async profile(@Req() request: Request) {
    const reqUser = request['user'];
    return await this.userService.findOrThrow(reqUser.sub);
  }
}
