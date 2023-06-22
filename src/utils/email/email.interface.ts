import { AdminCreateUserDto } from 'src/users/dto/admin-create-user.dto';

export interface IEmailService {
  sendEmail(userData: AdminCreateUserDto, template: string): Promise<void>;
}

export const IEmailService = Symbol('IEmailService');
