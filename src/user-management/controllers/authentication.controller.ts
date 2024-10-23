import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { LoginDto } from '../dto/login.dto';
import { AuthGuard } from 'src/common/auth/auth.guard';

@Controller('api/authentication')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authenticationService.signIn(loginDto);
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  profile(@Req() req) {
    return req.user;
  }
}
