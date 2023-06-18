import { AdminCreateUserDto } from '../dto/admin-create-user.dto';
import { AdminUpdateUserDto } from '../dto/admin-update-user.dto';
import { CreateUserPasswordDto } from '../dto/create-user-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

export interface IUserService {
  create(adminCreateUserDto: AdminCreateUserDto): Promise<{ message: string }>;
  count(): Promise<number>;
  findAll(): Promise<User[]>;
  findOne(id: string): Promise<User>;
  findToLogin(id: string): Promise<User>;
  findOneByToken(token: string): Promise<User>;
  findOneByEmail(email: string): Promise<User>;
  updateByAdmin(id: string, adminUpdateUserDto: AdminUpdateUserDto): Promise<User>;
  update(id: string, updateUserDto: UpdateUserDto, image?: Express.Multer.File): Promise<User>;
  createPassword(token: string, createUserPasswordDto: CreateUserPasswordDto): Promise<{ access_token: string }>;
  sendResetPassEmail(email: string): Promise<{ message: string }>;
  resetPassword(token: string, resetPasswordDto: ResetPasswordDto): Promise<{ access_token: string }>;
  remove(id: string): Promise<{ message: string }>;
}

export const IUserService = Symbol('IUserService');
