import { Environment } from '../entities/environment.entity';
import { IBaseRepository } from 'src/base/base.interface';

export interface IEnvironmentRepository extends IBaseRepository<Environment> {}

export const IEnvironmentRepository = Symbol('IEnvironmentRepository');
