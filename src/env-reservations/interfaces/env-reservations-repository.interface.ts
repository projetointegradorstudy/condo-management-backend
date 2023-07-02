import { EnvReservation } from '../entities/env-reservation.entity';
import { IBaseRepository } from 'src/base-entity/base-entity.interface';

export interface IEnvReservationRepository extends IBaseRepository<EnvReservation> {}

export const IEnvReservationRepository = Symbol('IEnvReservationRepository');
