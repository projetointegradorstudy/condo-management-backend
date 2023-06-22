import { Environment } from '../entities/environment.entity';
import { IBaseRepository } from 'src/base-entity/base-entity.interface';

export interface IEnvironmentRepository extends IBaseRepository<Environment> {}

export const IEnvironmentRepository = Symbol('IEnvironmentRepository');
