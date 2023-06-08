import { AdminCreateUserDto } from '../dto/admin-create-user.dto';
import { AdminUpdateUserDto } from '../dto/admin-update-user.dto';
import { CreateUserPasswordDto } from '../dto/create-user-password.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

export interface IUserService {
  create(adminCreateUserDto: AdminCreateUserDto): Promise<{ message: string }>;
  findAll(): Promise<User[]>;
  findOne(id: string): Promise<User>;
  findToLogin(id: string): Promise<User>;
  findOneByToken(token: string): Promise<User>;
  findOneByEmail(email: string): Promise<User>;
  updateByAdmin(id: string, adminUpdateUserDto: AdminUpdateUserDto): Promise<User>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
  createPassword(token: string, createUserPasswordDto: CreateUserPasswordDto): Promise<{ access_token: string }>;
  sendResetPassEmail(requestEmailDto: AdminCreateUserDto): Promise<{ message: string }>;
  remove(id: string): Promise<{ message: string }>;
}

export const IUserService = Symbol('IUserService');
