import { DeepPartial, Repository, FindManyOptions, DeleteResult, FindOptionsWhere, UpdateResult } from 'typeorm';
import { IBaseRepository } from './base-entity.interface';

export class BaseRepository<T> implements IBaseRepository<T> {
  private entity: Repository<T>;
  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  public async create(data: DeepPartial<T>): Promise<T> {
    return await this.entity.create(data);
  }

  public async find(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(options);
  }

  public async findById(where: FindOptionsWhere<T>): Promise<T> {
    return await this.entity.findOneBy(where);
  }

  public async update(id: string, partialEntity: DeepPartial<T>): Promise<UpdateResult> {
    return await this.entity.update(id, partialEntity as any);
  }

  public async softDelete(id: string): Promise<DeleteResult> {
    return await this.entity.softDelete(id);
  }
}
