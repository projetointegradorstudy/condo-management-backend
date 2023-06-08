import { HttpException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import * as path from 'path';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(user: User, template: string, pin?: number) {
    user.partial_token = user.partial_token ?? crypto.randomBytes(32).toString('hex');
    const mail = {
      to: user.email,
      subject: template,
      template: path.resolve(__dirname, '..', '..', `templates/${template}.hbs`),
      context: {
        token: user.partial_token,
        host: process.env.BASE_FRONT_URL,
        pin,
      },
      attachments: [
        {
          filename: 'iconInstagram.png',
          path: path.resolve(__dirname, '..', '..', 'templates/attachments/iconInstagram.png'),
          cid: 'iconInsta',
        },
        {
          filename: 'iconLogo.png',
          path: path.resolve(__dirname, '..', '..', 'templates/attachments/iconLogo.png'),
          cid: 'iconLogo',
        },
        {
          filename: 'iconTelegram.png',
          path: path.resolve(__dirname, '..', '..', 'templates/attachments/iconTelegram.png'),
          cid: 'iconTele',
        },
        {
          filename: 'iconWhatsapp.png',
          path: path.resolve(__dirname, '..', '..', 'templates/attachments/iconWhatsapp.png'),
          cid: 'iconWhats',
        },
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
