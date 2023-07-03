import { HttpException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { IUserService } from './interfaces/users-service.interface';
import { IUserRepository } from './interfaces/users-repository.interface';
import { CreateUserPasswordDto } from './dto/create-user-password.dto';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { IS3Service } from 'src/utils/upload/s3.interface';
import { User } from './entities/user.entity';
import { EnvReservation } from 'src/env-reservations/entities/env-reservation.entity';
import { IEmailService } from 'src/utils/email/email.interface';
import { IAuthService } from 'src/auth/interfaces/auth-service.interface';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(IS3Service) private readonly s3Service: IS3Service,
    @Inject(IEmailService) private readonly emailService: IEmailService,
    @Inject(forwardRef(() => IAuthService))
    private readonly authService: IAuthService,
  ) {}

  async create(adminCreateUserDto: AdminCreateUserDto): Promise<{ message: string }> {
    await this.emailService.sendEmail(adminCreateUserDto, 'Create-password');
    await this.userRepository.create(adminCreateUserDto);
    return { message: 'User created successfully' };
  }

  async count(): Promise<number> {
    return await this.userRepository.count();
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findBy({ where: { id } });
    if (!user) throw new NotFoundException();
    return user;
  }

  async findEnvReservationsById(id: string): Promise<EnvReservation[]> {
    const user = await this.userRepository.findBy({ where: { id }, relations: ['env_requests'] });
    if (!user) throw new NotFoundException();
    return user.env_requests;
  }

  async findToLogin(email: string): Promise<User> {
    return await this.userRepository.findWtCredencial(email);
  }

  async findOneByToken(token: string): Promise<User> {
    const user = await this.userRepository.findBy({ where: { partial_token: token } });
    if (!user) throw new NotFoundException('Invalid token');
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findBy({ where: { email } });
    if (!user) throw new NotFoundException('Email not found');
    return user;
  }

  async updateByAdmin(id: string, adminUpdateUserDto: AdminUpdateUserDto): Promise<User> {
    await this.findOne(id);
    return await this.userRepository.update({ id }, adminUpdateUserDto);
  }

  async update(id: string, updateUserDto: UpdateUserDto, image?: Express.Multer.File): Promise<User> {
    const user = await this.findOne(id);
    if (image) {
      const imageUploaded = await this.s3Service.uploadFile(image, user.avatar);
      updateUserDto['avatar'] = imageUploaded.Location;
    }
    return await this.userRepository.update({ id }, updateUserDto);
  }

  async createPassword(token: string, createUserPasswordDto: CreateUserPasswordDto): Promise<{ access_token: string }> {
    const user = await this.findOneByToken(token);
    createUserPasswordDto.partial_token = null;
    createUserPasswordDto.is_active = true;
    await this.userRepository.update({ id: user.id }, createUserPasswordDto);
    const auth: AuthCredentialsDto = { email: user.email, password: createUserPasswordDto.password };
    return await this.authService.login(auth);
  }

  async sendResetPassEmail(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findBy({ where: { email } });
    if (!user) throw new HttpException({ message: 'An email with recovery password instructions will be sent' }, 200);
    await this.emailService.sendEmail(user, 'Recover-password');
    await this.userRepository.update({ id: user.id }, { partial_token: user.partial_token });
    return {
      message: 'An email with recovery password instructions will be sent',
    };
  }

  async resetPassword(token: string, resetPasswordDto: ResetPasswordDto): Promise<{ access_token: string }> {
    const user = await this.findOneByToken(token);
    await this.userRepository.update({ id: user.id }, { password: resetPasswordDto.password, partial_token: null });
    const auth: AuthCredentialsDto = { email: user.email, password: resetPasswordDto.password };
    return await this.authService.login(auth);
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);
    await this.userRepository.softDelete(id);
    return { message: 'User deleted successfully' };
  }
}
