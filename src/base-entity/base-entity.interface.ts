import { DeepPartial, DeleteResult, FindManyOptions, FindOptionsWhere } from 'typeorm';

export interface IBaseRepository<T> {
  create(data: DeepPartial<T>): Promise<T>;
  find(options?: FindManyOptions<T>): Promise<T[]>;
  findBy(where: FindOptionsWhere<T>): Promise<T>;
  update(id: FindOptionsWhere<T>, data: DeepPartial<T>): Promise<T>;
  softDelete(id: string): Promise<DeleteResult>;
}
