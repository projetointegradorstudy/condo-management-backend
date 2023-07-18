import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { IUserRepository } from './interfaces/users-repository.interface';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class UsersRepository extends BaseRepository<User> implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    super(usersRepository);
  }

  async findWtCredencial(email: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: { email },
      select: [
        'id',
        'avatar',
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'partial_token',
        'created_at',
        'updated_at',
        'deleted_at',
      ],
    });
  }
}
