import { HttpException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { IUserService } from './interfaces/users.service';
import { IUserRepository } from './interfaces/users.repository';
import { EmailService } from 'src/utils/email.service';
import { CreateUserPasswordDto } from './dto/create-user-password.dto';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { AuthService } from 'src/auth/auth.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    private readonly emailService: EmailService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async create(adminCreateUserDto: AdminCreateUserDto) {
    await this.emailService.sendEmail(adminCreateUserDto, 'Create-password');
    await this.userRepository.create(adminCreateUserDto);
    return { message: 'User created successfully' };
  }

  async count() {
    return await this.userRepository.count();
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findBy({ id });
    if (!user) throw new NotFoundException();
    return user;
  }

  async findToLogin(email: string) {
    return await this.userRepository.findWtCredencial(email);
  }

  async findOneByToken(token: string) {
    const user = await this.userRepository.findBy({ partial_token: token });
    if (!user) throw new NotFoundException('Invalid token');
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findBy({ email });
    if (!user) throw new NotFoundException('Email not found');
    return user;
  }

  async updateByAdmin(id: string, adminUpdateUserDto: AdminUpdateUserDto) {
    await this.findOne(id);
    return await this.userRepository.update({ id }, adminUpdateUserDto);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    return await this.userRepository.update({ id }, updateUserDto);
  }

  async createPassword(token: string, createUserPasswordDto: CreateUserPasswordDto) {
    const user = await this.findOneByToken(token);
    createUserPasswordDto.partial_token = null;
    createUserPasswordDto.is_active = true;
    await this.userRepository.update({ id: user.id }, createUserPasswordDto);
    const auth: AuthCredentialsDto = { email: user.email, password: createUserPasswordDto.password };
    return await this.authService.login(auth);
  }

  async sendResetPassEmail(email: string) {
    const user = await this.userRepository.findBy({ email });
    if (!user) throw new HttpException({ message: 'An email with recovery password instructions will be sent' }, 200);
    await this.emailService.sendEmail(user, 'Recover-password');
    await this.userRepository.update({ id: user.id }, { partial_token: user.partial_token });
    return {
      message: 'An email with recovery password instructions will be sent',
    };
  }

  async resetPassword(token: string, resetPasswordDto: ResetPasswordDto) {
    const user = await this.findOneByToken(token);
    await this.userRepository.update({ id: user.id }, { password: resetPasswordDto.password, partial_token: null });
    const auth: AuthCredentialsDto = { email: user.email, password: resetPasswordDto.password };
    return await this.authService.login(auth);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.userRepository.softDelete(id);
    return { message: 'User deleted successfully' };
  }
}
