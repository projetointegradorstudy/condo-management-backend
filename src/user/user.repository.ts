import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super(userRepository.target, userRepository.manager);
  }

  async createUser(createUserDto: CreateUserDto) {
    const createdUser = this.userRepository.create(createUserDto);
    const storedUser = await this.userRepository.save(createdUser);
    delete storedUser.password;
    return storedUser;
  }

  async findById(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findWtCredencial(username: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .where(`user.username = '${username}'`)
      .addSelect('user.password')
      .getOne();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = this.userRepository.create(updateUserDto);
    await this.userRepository.update({ id }, updatedUser);
    return await this.findById(id);
  }
}
