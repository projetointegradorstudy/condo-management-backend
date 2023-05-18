import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export interface IUserRepository {
  createUser(createEnvironmentDto: CreateUserDto): Promise<User>;
  findById(id: string): Promise<User>;
  findWtCredencial(id: string): Promise<User>;
  updateUser(id: string, updateEnvironmentDto: UpdateUserDto): Promise<User>;
}

export const IUserRepository = Symbol('IUserRepository');
