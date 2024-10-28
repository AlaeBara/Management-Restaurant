import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from 'src/user-management/dto/authentication/login.dto';

import { hash, verify } from 'argon2';
import { Repository } from 'typeorm';
import { User } from 'src/user-management/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserStatus } from 'src/user-management/enums/user-status.enum';

@Injectable()
export class AuthenticationService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async signIn(loginDto: LoginDto): Promise<any> {
    const user = await this.findUserByEmailOrUsername(loginDto.emailOrUsername);
    if (!(await this.canUserLogin(user))) {
      // Add await here
      throw new UnauthorizedException(
        'Your account is currently restricted. Please contact support for assistance.',
      );
    }
    //await this.isEmailVerified(user); // TODO: Uncomment this when email verification is implemented
    await this.verifyPassword(user, loginDto.password);
    await this.updateLastLogin(user.id);
    return await this.initializePayload(user);
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('roles.permissions', 'permissions')
      .where('user.username = :username', { username })
      .getOne();

    if (user && (await verify(user.password, password))) {
      return user;
    }
    throw new UnauthorizedException('credentials are invalid');
  }

  async initializePayload(user: User) {
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles.map((role) => role.name),
      permissions: user.roles.flatMap((role) =>
        role.permissions.map((perm) => perm.name),
      ),
    };
    return payload;
  }

  async validateJwtToken(request: Request): Promise<boolean> {

    try {

      const token = request.headers['authorization']?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      const decoded = await this.jwtService.verifyAsync(token);
      // Check if the token is expired or invalid
      if (!decoded) {
        throw new UnauthorizedException('Invalid token');
      }
      // Optionally verify if the user still exists and is active
      const user = await this.userRepository.findOne({
        where: { id: decoded.sub }
      });
      if (!user || !(await this.canUserLogin(user))) {
        throw new UnauthorizedException('Invalid token');
      }
      return decoded;
    } catch (error) {
      // Token is invalid or expired
      throw new UnauthorizedException('a problem occurred while validating the token');
    }
  }

  private async findUserByEmailOrUsername(
    emailOrUsername: string,
  ): Promise<any> {
    const user = await this.userRepository.findOne({
      where: [{ email: emailOrUsername }, { username: emailOrUsername }],
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        status: true,
      },
      relations: {
        roles: {
          permissions: true,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('credentials are invalid');
    }
    return user;
  }

  private async verifyPassword(user: User, password: string): Promise<void> {
    const isPasswordValid = await verify(user.password, password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('credentials are invalid');
    }
  }

  private async updateLastLogin(userId: number): Promise<void> {
    await this.userRepository.update(userId, { lastLogin: new Date() });
  }

  private async generateAccessToken(
    user: User,
  ): Promise<{ access_token: string }> {
    const payload = { sub: user.id, username: user.username };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }

  async canUserLogin(user: User): Promise<boolean> {
    const nonLoginableStatuses = [
      UserStatus.BANNED,
      UserStatus.DELETED,
      UserStatus.SUSPENDED,
      UserStatus.ARCHIVED,
      UserStatus.INACTIVE,
      UserStatus.EMAIL_UNVERIFIED,
    ];
    return !nonLoginableStatuses.includes(user.status);
  }

  async isEmailVerified(user: User): Promise<boolean> {
    await user.status !== UserStatus.EMAIL_UNVERIFIED;
    if (user.isEmailVerified === true) {
      return true;
    }
    throw new UnauthorizedException('Your email is not verified');
  }
}
