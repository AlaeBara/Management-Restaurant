import {
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { LoginDto } from '../dto/authentication/login.dto';
import { Public, Roles } from 'src/user-management/decorators/auth.decorator';
import { JwtService } from '@nestjs/jwt';

@Controller('api/authentication')
export class AuthenticationController {
  constructor(
    private jwtService: JwtService,
    private authenticationService: AuthenticationService,
  ) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const payload = await this.authenticationService.signIn(loginDto);
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  @Post('register')
  async register(
    @Body() registerDto: { username: string; email: string; password: string },
  ) {
    return this.authenticationService.register(
      registerDto.username,
      registerDto.email,
      registerDto.password,
    );
  }
}
