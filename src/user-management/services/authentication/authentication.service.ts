import { JwtService } from '@nestjs/jwt';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from 'src/user-management/dto/authentication/login.dto';

import { hash, verify } from 'argon2';
import { Repository } from 'typeorm';
import { User } from 'src/user-management/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthenticationService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

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
    return null;
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

  async register(username: string, email: string, password: string) {
    const hashedPassword = await hash(password);
    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
    return user;
  }

  async signIn(loginDto: LoginDto): Promise<any> {
    const user = await this.findUserByEmailOrUsername(loginDto.emailOrUsername);
    await this.verifyPassword(user, loginDto.password);
    await this.updateLastLogin(user.id);
    return await this.initializePayload(user);
   // return this.generateAccessToken(payload);
  }

  private async findUserByEmailOrUsername(
    emailOrUsername: string,
  ): Promise<any> {
   /*  const user = await this.userRepository.findOneBy({
      email: emailOrUsername,
      username: emailOrUsername,
    }); */

    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('roles.permissions', 'permissions')
      .where('user.username = :username', { username: emailOrUsername })
      .orWhere('user.email = :email', { email: emailOrUsername })
      .getOne();
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
}