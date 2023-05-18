import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

export interface IUserService {
  create(createUserDto: CreateUserDto): Promise<User>;
  findAll(): Promise<User[]>;
  findOne(id: string): Promise<User>;
  findToLogin(id: string): Promise<User>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
  updateByAdmin(id: string, updateUserDto: UpdateUserDto): Promise<User>;
  remove(id: string): Promise<any>;
}

export const IUserService = Symbol('IUserService');
