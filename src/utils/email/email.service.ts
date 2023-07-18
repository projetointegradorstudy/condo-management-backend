import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import * as path from 'path';
import { AdminCreateUserDto } from 'src/users/dto/admin-create-user.dto';
import { IEmailService } from './email.interface';

@Injectable()
export class EmailService implements IEmailService {
  private host: string;
  constructor(private mailerService: MailerService) {
    this.host = process.env.BASE_FRONT_URL;
  }

  async sendEmail(userData: AdminCreateUserDto, template: string): Promise<void> {
    userData.partial_token = userData.partial_token ?? crypto.randomBytes(32).toString('hex');
    const mail = {
      to: userData.email,
      subject: template,
      template: path.resolve(__dirname, '..', '..', '..', `templates/${template}.hbs`),
      context: {
        token: userData.partial_token,
        host: this.host,
      },
      attachments: [
        {
          filename: 'logo.png',
          path: path.resolve(__dirname, '..', '..', '..', 'templates/attachments/logo.png'),
          cid: 'logo',
        },
      ],
    };
    try {
      await this.mailerService.sendMail(mail);
    } catch (e) {
      throw new BadRequestException(`There are something wrong in email's smtp`);
    }
  }
}
