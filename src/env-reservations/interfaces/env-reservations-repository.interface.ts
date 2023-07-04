import { EnvReservation } from '../entities/env-reservation.entity';
import { IBaseRepository } from 'src/base/base.interface';

export interface IEnvReservationRepository extends IBaseRepository<EnvReservation> {}

export const IEnvReservationRepository = Symbol('IEnvReservationRepository');
