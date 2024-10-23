import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import {
  Body,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from 'src/user-management/dto/login.dto';
import { PrismaService } from 'prisma/prisma.service';
import { BaseService } from 'src/common/services/base.service';
import { User } from '@prisma/client';
import { verify } from 'argon2';

@Injectable()
export class AuthenticationService extends BaseService<User> {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {
    super(prismaService, 'user');
  }

  async signIn(loginDto: LoginDto): Promise<any> {
    const user = await this.findFirst({
      OR: [
        { email: loginDto.emailOrUsername },
        { username: loginDto.emailOrUsername },
      ],
    });
    if (!user) {
      throw new NotFoundException('credentials are invalid');
    }

    const isPasswordValid = await verify(user.password, loginDto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('credentials are invalid');
    }

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
