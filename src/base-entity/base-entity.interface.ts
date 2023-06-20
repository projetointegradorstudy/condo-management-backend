import { DeepPartial, DeleteResult, FindManyOptions, FindOptionsWhere, FindOneOptions } from 'typeorm';

export interface IBaseRepository<T> {
  create(data: DeepPartial<T>): Promise<T>;
  count(options?: FindManyOptions<T>): Promise<number>;
  find(options?: FindManyOptions<T>): Promise<T[]>;
  findBy(where: FindOneOptions<T>): Promise<T>;
  update(id: FindOptionsWhere<T>, data: DeepPartial<T>): Promise<T>;
  softDelete(id: string): Promise<DeleteResult>;
}
