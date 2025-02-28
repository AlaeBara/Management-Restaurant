import { Body, Controller, Post, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthenticationService } from '../services/authentication/authentication.service';
import { LoginDto } from '../dto/authentication/login.dto';
import { Public } from 'src/user-management/decorators/auth.decorator';

@ApiTags('authentication')
@Controller('api/authentication')
export class AuthenticationController {
  constructor(
    private jwtService: JwtService,
    private authenticationService: AuthenticationService,
  ) { }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  async login(@Body() loginDto: LoginDto) {
    return {
      access_token: await this.authenticationService.signIn(loginDto),
    };
  }

  @Public()
  @Post('validate-token')
  @ApiOperation({ summary: 'Validate a JWT token' })
  async validateTokenRequest(@Req() request: Request) {
    return this.authenticationService.validateJwtToken(request);
  }
}
