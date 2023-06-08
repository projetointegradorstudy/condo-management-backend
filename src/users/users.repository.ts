import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { IUserRepository } from './interfaces/users.repository';

@Injectable()
export class UsersRepository extends Repository<User> implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super(usersRepository.target, usersRepository.manager);
  }

  async createUser(adminCreateUserDto: AdminCreateUserDto) {
    const createdUser = this.usersRepository.create(adminCreateUserDto);
    const storedUser = await this.usersRepository.save(createdUser);
    delete storedUser.password;
    return storedUser;
  }

  async findById(id: string) {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async findByToken(token: string) {
    return await this.usersRepository.findOne({ where: { partial_token: token } });
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findWtCredencial(email: string) {
    return await this.usersRepository
      .createQueryBuilder('user')
      .where(`user.email = '${email}'`)
      .addSelect('user.password')
      .getOne();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = this.usersRepository.create(updateUserDto);
    await this.usersRepository.update({ id }, updatedUser);
    return await this.findById(id);
  }
}
