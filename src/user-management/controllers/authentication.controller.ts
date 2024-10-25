import { Body, Controller, Get, Inject, InternalServerErrorException, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { LoginDto } from '../dto/authentication/login.dto';
import { AuthGuard } from 'src/user-management/guards/auth.guard';
import { Roles } from 'src/user-management/decorators/roles.decorator';
import { verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Permissions } from '../decorators/permission.decorator';

@Controller('api/authentication')
//@UseGuards(AuthGuard)
export class AuthenticationController {
  constructor(private jwtService: JwtService,private authenticationService: AuthenticationService,){}

   @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const payload = await this.authenticationService.signIn(loginDto);
     return {
      access_token: await this.jwtService.signAsync(payload),
    };
  } 

  @Get('/profile')
  @UseGuards(AuthGuard)
  @Roles('user')
  @Permissions('show-profile')
  async profile() {
    return 'hello';
  }

  @Post('register')
  async register(@Body() registerDto: { username: string; email: string; password: string }) {
    return this.authenticationService.register(registerDto.username, registerDto.email, registerDto.password);
  }
}
