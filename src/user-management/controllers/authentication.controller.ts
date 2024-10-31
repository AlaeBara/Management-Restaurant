import {
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Post,
  Req,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { LoginDto } from '../dto/authentication/login.dto';
import { Public, Roles } from 'src/user-management/decorators/auth.decorator';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../services/user/user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('authentication')
@Controller('api/authentication')
export class AuthenticationController {
  constructor(
    private jwtService: JwtService,
    private authenticationService: AuthenticationService,
  ) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return {
      access_token: await this.authenticationService.signIn(loginDto),
    };
  }

  @Public()
  @Post('validate-token')
  async validateTokenRequest(@Req() request: Request) {
    return this.authenticationService.validateJwtToken(request);
  }
}
