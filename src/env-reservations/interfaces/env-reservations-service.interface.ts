import { User } from 'src/users/entities/user.entity';
import { CreateEnvReservationDto } from '../dto/create-env-reservations.dto';
import { UpdateEnvReservationDto } from '../dto/update-env-reservations.dto';
import { EnvReservation } from '../entities/env-reservation.entity';

export interface IEnvReservationService {
  create(createEnvReservationDto: CreateEnvReservationDto, id: string): Promise<EnvReservation>;
  count(): Promise<number>;
  findAll(status: string): Promise<EnvReservation[]>;
  findAllByUser(userId: string, status: string): Promise<EnvReservation[]>;
  findOne(id: string): Promise<EnvReservation>;
  update(id: string, updateEnvReservationDto: UpdateEnvReservationDto, user: Partial<User>): Promise<EnvReservation>;
  remove(id: string): Promise<{ message: string }>;
}

export const IEnvReservationService = Symbol('IEnvReservationService');
