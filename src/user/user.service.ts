import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const createdUser = this.userRepository.create(createUserDto);
    const storedUser = await this.userRepository.save(createdUser);
    delete storedUser.password;
    return storedUser;
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(uuid: string) {
    const user = await this.userRepository.findOne({ where: { id: uuid } });
    if (!user) throw new NotFoundException();
    return user;
  }

  async update(uuid: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(uuid);
    await this.userRepository.update({ id: user.id }, updateUserDto);
    return await this.findOne(uuid);
  }

  async updateByAdmin(uuid: string, adminUpdateUserDto: AdminUpdateUserDto) {
    return `This action updates a #${uuid} user`;
  }

  async remove(uuid: string) {
    const user = await this.findOne(uuid);
    await this.userRepository.delete(uuid);
    return { message: 'User deleted successfully' };
  }
}
