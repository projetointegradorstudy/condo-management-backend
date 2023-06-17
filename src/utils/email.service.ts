import { HttpException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import * as path from 'path';
import { AdminCreateUserDto } from 'src/users/dto/admin-create-user.dto';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(user: AdminCreateUserDto, template: string) {
    user.partial_token = user.partial_token ?? crypto.randomBytes(32).toString('hex');
    const mail = {
      to: user.email,
      subject: template,
      template: path.resolve(__dirname, '..', '..', `templates/${template}.hbs`),
      context: {
        token: user.partial_token,
        host: process.env.BASE_FRONT_URL,
      },
      attachments: [
        {
          filename: 'logo.png',
          path: path.resolve(__dirname, '..', '..', 'templates/attachments/logo.png'),
          cid: 'logo',
        },
      ],
    };
    try {
      await this.mailerService.sendMail(mail);
    } catch (e) {
      throw new HttpException({ error: `There are something wrong in email's smtp` }, 400);
    }
  }
}
