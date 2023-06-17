import { User } from '../entities/user.entity';
import { IBaseRepository } from 'src/base-entity/base-entity.interface';

export interface IUserRepository extends IBaseRepository<User> {
  findWtCredencial(id: string): Promise<User>;
}

export const IUserRepository = Symbol('IUserRepository');
