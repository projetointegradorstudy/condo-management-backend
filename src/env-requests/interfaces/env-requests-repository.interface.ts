import { EnvRequest } from '../entities/env-request.entity';
import { IBaseRepository } from 'src/base-entity/base-entity.interface';

export interface IEnvRequestRepository extends IBaseRepository<EnvRequest> {}

export const IEnvRequestRepository = Symbol('IEnvRequestRepository');
