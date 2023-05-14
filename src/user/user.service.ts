import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

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

  async findToLogin(username: string) {
    return await this.userRepository.findWtCredencial(username);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    return await this.userRepository.updateUser(user.id, updateUserDto);
  }

  async updateByAdmin(id: string, adminUpdateUserDto: AdminUpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.delete(user.id);
    return { message: 'User deleted successfully' };
  }
}
