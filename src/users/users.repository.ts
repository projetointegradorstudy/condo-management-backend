import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { IUserRepository } from './interfaces/users.repository';
import { BaseRepository } from 'src/base-entity/base-entity.repository';

@Injectable()
export class UsersRepository extends BaseRepository<User> implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    super(usersRepository);
  }

  async findWtCredencial(email: string) {
    return await this.usersRepository
      .createQueryBuilder('user')
      .where(`user.email = '${email}'`)
      .addSelect('user.password')
      .getOne();
  }
}
