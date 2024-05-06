import { User } from '../entities/user.entity';
import { IBaseRepository } from 'src/base/base.interface';

export interface IUserRepository extends IBaseRepository<User> {
  findWtCredencial(id: string): Promise<User>;
  updatePartialToken(email: string, token: string | null): Promise<void>;
}

export const IUserRepository = Symbol('IUserRepository');
