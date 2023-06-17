import { DeepPartial, DeleteResult, UpdateResult, FindManyOptions, FindOptionsWhere } from 'typeorm';

export interface IBaseRepository<T> {
  create(data: DeepPartial<T>): Promise<T>;
  find(options?: FindManyOptions<T>): Promise<T[]>;
  findBy(where: FindOptionsWhere<T>): Promise<T>;
  update(id: string, data: DeepPartial<T>): Promise<UpdateResult>;
  softDelete(id: string): Promise<DeleteResult>;
}
