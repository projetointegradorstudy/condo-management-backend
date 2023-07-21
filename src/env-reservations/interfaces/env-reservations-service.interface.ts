import { User } from 'src/users/entities/user.entity';
import { CreateEnvReservationDto } from '../dto/create-env-reservations.dto';
import { UpdateEnvReservationDto } from '../dto/update-env-reservations.dto';
import { EnvReservation } from '../entities/env-reservation.entity';
import { EnvReservationStatus } from '../entities/status.enum';

export interface IEnvReservationService {
  create(createEnvReservationDto: CreateEnvReservationDto, id: string): Promise<{ message: string }>;
  count(status?: EnvReservationStatus): Promise<number>;
  findAll(status?: EnvReservationStatus): Promise<EnvReservation[]>;
  findAllByUser(userId: string, status?: EnvReservationStatus): Promise<EnvReservation[]>;
  findOne(id: string): Promise<EnvReservation>;
  update(id: string, updateEnvReservationDto: UpdateEnvReservationDto, user: Partial<User>): Promise<EnvReservation>;
  remove(id: string): Promise<{ message: string }>;
}

export const IEnvReservationService = Symbol('IEnvReservationService');
