import { User } from '../entities/user.entity';
import { AdminCreateUserDto } from '../dto/admin-create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export interface IUserRepository {
  createUser(adminCreateUserDto: AdminCreateUserDto): Promise<User>;
  findById(id: string): Promise<User>;
  findByToken(token: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findWtCredencial(id: string): Promise<User>;
  updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User>;
}

export const IUserRepository = Symbol('IUserRepository');
