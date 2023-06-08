import { HttpException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { UsersRepository } from './users.repository';
import { IUserService } from './interfaces/users.service';
import { EmailService } from 'src/utils/email.service';
import { CreateUserPasswordDto } from './dto/create-user-password.dto';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly emailService: EmailService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async create(adminCreateUserDto: AdminCreateUserDto) {
    await this.emailService.sendEmail(adminCreateUserDto, 'Create-password');
    await this.userRepository.createUser(adminCreateUserDto);
    return { message: 'User created successfully' };
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  async findToLogin(email: string) {
    return await this.userRepository.findWtCredencial(email);
  }

  async findOneByToken(token: string) {
    const user = await this.userRepository.findByToken(token);
    if (!user) throw new NotFoundException('Invalid token');
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('Email not found');
    return user;
  }

  async updateByAdmin(id: string, adminUpdateUserDto: AdminUpdateUserDto) {
    const user = await this.findOne(id);
    return await this.userRepository.updateUser(user.id, adminUpdateUserDto);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    return await this.userRepository.updateUser(user.id, updateUserDto);
  }

  async createPassword(token: string, createUserPasswordDto: CreateUserPasswordDto) {
    const user = await this.findOneByToken(token);
    createUserPasswordDto.partial_token = null;
    createUserPasswordDto.is_active = true;
    await this.userRepository.updateUser(user.id, createUserPasswordDto);
    const auth: AuthCredentialsDto = { email: user.email, password: createUserPasswordDto.password };
    return await this.authService.login(auth);
  }

  async sendResetPassEmail(requestEmailDto: AdminCreateUserDto) {
    const user = await this.userRepository.findByEmail(requestEmailDto.email);
    if (!user) throw new HttpException({ message: 'An email with recovery password instructions will be sent' }, 200);
    await this.emailService.sendEmail(user, 'Recover-password');
    await this.userRepository.update(user.id, { partial_token: user.partial_token });
    return {
      message: 'An email with recovery password instructions will be sent',
    };
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.softDelete(user.id);
    return { message: 'User deleted successfully' };
  }
}
