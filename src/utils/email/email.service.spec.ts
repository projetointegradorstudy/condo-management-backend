import { BadRequestException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import { AdminCreateUserDto } from 'src/users/dto/admin-create-user.dto';

describe('EmailService', () => {
  let emailService: EmailService;
  let mockMailerService: jest.Mocked<MailerService>;

  beforeEach(() => {
    mockMailerService = {
      sendMail: jest.fn(),
    } as unknown as jest.Mocked<MailerService>;

    emailService = new EmailService(mockMailerService);
  });

  describe('sendEmail', () => {
    it('should send and email when already have partial token', async () => {
      const recipient: AdminCreateUserDto = {
        email: 'test@test.com',
        partial_token: '4g68sdg4s68dg46s8g468sdfg468sdf4g86sdf4',
      };
      const template = 'Create-password';
      const mail = {
        to: recipient.email,
        subject: template,
        template: expect.any(String),
        context: {
          token: recipient.partial_token,
          host: undefined,
        },
        attachments: [
          {
            filename: 'logo.png',
            path: expect.any(String),
            cid: 'logo',
          },
        ],
      };

      mockMailerService.sendMail = jest.fn().mockResolvedValue(undefined);

      const result = await emailService.sendEmail(recipient, template);

      expect(mockMailerService.sendMail).toHaveBeenCalledWith(mail);
      expect(result).toEqual(undefined);
    });

    it('should generate a partial token and send and email when have not a partial token', async () => {
      const recipient: AdminCreateUserDto = {
        email: 'test@test.com',
      };
      const template = 'Create-password';
      const mail = {
        to: recipient.email,
        subject: template,
        template: expect.any(String),
        context: {
          token: expect.any(String),
          host: undefined,
        },
        attachments: [
          {
            filename: 'logo.png',
            path: expect.any(String),
            cid: 'logo',
          },
        ],
      };

      mockMailerService.sendMail = jest.fn().mockResolvedValue(undefined);

      const result = await emailService.sendEmail(recipient, template);

      expect(mockMailerService.sendMail).toHaveBeenCalledWith(mail);
      expect(result).toEqual(undefined);
    });

    it('should throw a bad request exception', async () => {
      const recipient: AdminCreateUserDto = { email: 'test@test.com' };
      const template = 'Create-password';

      mockMailerService.sendMail = jest.fn().mockRejectedValue(BadRequestException);

      await expect(emailService.sendEmail(recipient, template)).rejects.toThrowError(BadRequestException);
    });
  });
});
