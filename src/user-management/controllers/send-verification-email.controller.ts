import { Body, Controller, Post } from '@nestjs/common';
import { EmailVerificationService } from '../services/authentication/email-verification.service';
import { SendVerificationEmailDto } from '../dto/authentication/send-verification-email.dto';
import { Public } from '../decorators/auth.decorator';
import { VerifyEmailDto } from '../dto/authentication/verify-token-email.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/users/verification')
@ApiTags('User Verification')
@Public()
export default class SendVerificationEmailController {
  constructor(private readonly emailVerificationService: EmailVerificationService) {}
  @Post('mail')
  async sendMailer(@Body() request: SendVerificationEmailDto) {
    await this.emailVerificationService.sendVerificationEmail(request.email,request.forceResend);
  }

  @Post('verify')
  async verifyEmail(@Body() request: VerifyEmailDto) {
    await this.emailVerificationService.verifyEmail(request.token);
  }
}
