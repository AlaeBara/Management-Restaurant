import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { EmailVerificationService } from '../services/authentication/email-verification.service';
import { SendVerificationEmailDto } from '../dto/authentication/send-verification-email.dto';
import { Public } from '../decorators/auth.decorator';
import { VerifyEmailDto } from '../dto/authentication/verify-token-email.dto';

@Controller('api/users/verification')
@ApiTags('User Verification')
@Public()
export default class SendVerificationEmailController {
  constructor(private readonly emailVerificationService: EmailVerificationService) {}
  @Post('mail')
  @ApiOperation({ summary: 'Send a verification email' })
  async sendMailer(@Body() request: SendVerificationEmailDto) {
    await this.emailVerificationService.sendVerificationEmail(request.email,request.forceResend);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify an email' })
  async verifyEmail(@Body() request: VerifyEmailDto) {
    await this.emailVerificationService.verifyEmail(request.token);
  }
}
