import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { UsersRepository } from './users.repository';
import { IUserService } from './interfaces/users.service';

@Injectable()
export class UsersService implements IUserService {
  constructor(private readonly userRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.createUser(createUserDto);
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    return await this.userRepository.updateUser(user.id, updateUserDto);
  }

  async updateByAdmin(id: string, adminUpdateUserDto: AdminUpdateUserDto) {
    const user = await this.findOne(id);
    return await this.userRepository.updateUser(user.id, adminUpdateUserDto);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.delete(user.id);
    return { message: 'User deleted successfully' };
  }
}
