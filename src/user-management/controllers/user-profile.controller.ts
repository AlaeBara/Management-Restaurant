import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Req,
} from '@nestjs/common';
import { Permissions, Roles } from '../decorators/auth.decorator';
import { UserService } from '../services/user/user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NumericType } from 'typeorm';
import { UpdateUsernameDto } from '../dto/user/update-username.dto';
import { UpdatePasswordDto } from '../dto/user/update-password.dto';

@ApiTags('users/profile')
@Controller('api/users/profile')
@ApiBearerAuth()
export default class UserProfileController {
  constructor(private userService: UserService) {}
  //public async updateEmail(req: Request, res: Response) // in progress
  //public async updateUsernameById(@Param('id', ParseIntPipe) id: number,@Body() updateUsernameDto: UpdateUsernameDto,) // done
  //async updateUsernameByUser( @Req() request: Request,@Body() updateUsernameDto: UpdateUsernameDto,) // done
  //public async updatePassword(req: Request, res: Response) // in progress
  //async profile(@Req() request: Request) // done

  @Patch(':id/username')
  @Roles('superadmin')
  @Permissions('update-user-username')
  @ApiOperation({ summary: 'Update the username of a user by their ID' })
  async updateUsernameById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsernameDto: UpdateUsernameDto,
  ) {
    await this.userService.updateUsername(id, updateUsernameDto);
    return { message: 'Le nom d\'utilisateur a été mis à jour avec succès', status: 200 };
  }

  @Patch('username')
  @Permissions('update-user-username')
  @ApiOperation({ summary: 'Update the username of the authenticated user' })
  async updateUsernameByUser(
    @Req() request: Request,
    @Body() updateUsernameDto: UpdateUsernameDto,
  ) {
    const reqUser = request['user'];
    // Update the username for the authenticated user
    await this.userService.updateUsername(reqUser.sub, updateUsernameDto);
    return { message: 'Le nom d\'utilisateur a été mis à jour avec succès', status: 200 };
  }

  @Get()
  @ApiOperation({ summary: 'Get the profile of the authenticated user' })
  async profile(
    @Req() request: Request,
    @Query('relations') relations?: string[],
    @Query('withDeleted') withDeleted?: boolean,
  ) {
    const reqUser = request['user'];
    return await this.userService.findOrThrow(
      reqUser.sub,
      relations,
      withDeleted,
    );
  }

  @Patch('password')
  @Permissions('update-user-password')
  @ApiOperation({ summary: 'Update the password of the authenticated user' })
  async updatePassword(@Req() request: Request, @Body() updatePasswordDto: UpdatePasswordDto) {
     await this.userService.updatePasswordByProfile(request, updatePasswordDto);
     return {message: 'Votre mot de passe a été modifié avec succès. Merci de votre confiance.', status: 200};
  }
}
