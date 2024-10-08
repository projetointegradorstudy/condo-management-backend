import { DeepPartial, Repository, FindManyOptions, FindOptionsWhere, FindOneOptions, UpdateResult } from 'typeorm';
import { IBaseRepository } from './base.interface';

export class BaseRepository<T> implements IBaseRepository<T> {
  private entity: Repository<T>;
  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  public async create(data: DeepPartial<T>): Promise<T> {
    const createdEntity = await this.entity.create(data);
    return await this.entity.save(createdEntity);
  }

  public async count(options?: FindManyOptions<T>): Promise<number> {
    return await this.entity.count(options);
  }

  public async find(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(options);
  }

  public async findBy(where: FindOneOptions<T>): Promise<T> {
    return await this.entity.findOne(where);
  }

  public async update(id: FindOptionsWhere<T>, partialEntity: DeepPartial<T>): Promise<T> {
    const updatedEntity = await this.entity.create(partialEntity);
    await this.entity.update(id, updatedEntity as any);
    return this.entity.findOneBy(id);
  }

  public async softDelete(id: string): Promise<UpdateResult> {
    return await this.entity.softDelete(id);
  }
}
