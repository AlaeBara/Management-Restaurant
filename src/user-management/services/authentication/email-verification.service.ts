import { MailService } from 'src/common/services/mail.service';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { UserActionToken } from 'src/user-management/entities/user-action-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenType } from 'src/user-management/enums/token.enum';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserStatus } from 'src/user-management/enums/user-status.enum';

export class EmailVerificationService {
  constructor(
    private readonly mailService: MailService,
    private readonly userService: UserService,
    @InjectRepository(UserActionToken)
    private userActionTokenRepository: Repository<UserActionToken>,
  ) {}

  async generateVerificationToken(userId: number) {
    const token = uuidv4();
    const expirationTime = 3600000; // 1 hour in milliseconds
    const expiresAt = new Date(Date.now() + expirationTime);
    return { token, expiresAt };
  }

  async storeVerificationToken(
    token: string,
    userId: number,
    duration: number,
  ) {
    await this.userActionTokenRepository.save({
      token,
      type: TokenType.VERIFICATION,
      expiresAt: new Date(Date.now() + duration),
      user: { id: userId },
    });
  }

  async validateAndSendToken(
    token: string,
    userId: number,
    duration: number,
    forceResend?: boolean,
  ) {
    const existingToken = await this.userActionTokenRepository.findOne({
      where: {
        user: { id: userId },
        type: TokenType.VERIFICATION,
      },
    });

    if (existingToken && existingToken.expiresAt < new Date()) {
      await this.userActionTokenRepository.delete(existingToken.id);
    }

    if (forceResend && existingToken) {
      await this.userActionTokenRepository.delete(existingToken.id);
      await this.storeVerificationToken(token, userId, duration);
      return;
    }

    if (existingToken && existingToken.expiresAt > new Date()) {
      throw new ConflictException(
        'Un token de vérification a déjà été envoyé récemment. Veuillez vérifier votre email.',
      );
    }

    await this.storeVerificationToken(token, userId, duration);
  }

  async sendVerificationEmail(email: string, forceResend?: boolean) {
    const user = await this.userService.findOrThrowByAttribute({ email });
    if (user.isEmailVerified) {
      throw new ConflictException('Email déjà vérifié.');
    }
    const { token } = await this.generateVerificationToken(user.id);

    const verificationLink = `${process.env.VERIFICATION_EMAIL_URL}?token=${token}`;
    const message = `Veuillez cliquer sur le lien suivant pour vérifier votre email: ${verificationLink}`;
    const tokenDuration = 900000; // 15 minutes en millisecondes
    await this.validateAndSendToken(token, user.id, tokenDuration, forceResend);
    await this.mailService.sendEmail(
      process.env.BASE_EMAIL,
      user.email,
      'Restaurant Management System - Vérifiez votre email',
      message,
    );
  }

  async verifyToken(token: string) {
    const userActionToken = await this.userActionTokenRepository.findOne({
      where: { token, type: TokenType.VERIFICATION },
      relations: ['user'],
    });
    if (!userActionToken) {
      throw new NotFoundException('Token non trouvé');
    }
    if (userActionToken.expiresAt < new Date()) {
      throw new ConflictException('Token expiré');
    }
    return userActionToken;
  }

  async updateUserEmailVerificationStatus(userActionToken: UserActionToken) {
    await this.userService.update(userActionToken.user.id, {
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      status: UserStatus.ACTIVE,
    });
  }

  async verifyEmail(token: string) {
    const userActionToken = await this.verifyToken(token);
    await this.updateUserEmailVerificationStatus(userActionToken);
    await this.userActionTokenRepository.delete(userActionToken.id);
  }
}
