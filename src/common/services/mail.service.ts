import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}

  async sendEmail(from: string, to: string, subject: string, message: string) {

    this.mailService.sendMail({
      from: from,
      to: to,
      subject: subject,
      text: message,
    });
  }
}
