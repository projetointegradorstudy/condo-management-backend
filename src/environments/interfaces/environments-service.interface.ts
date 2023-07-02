import { EnvReservation } from 'src/env-reservations/entities/env-reservation.entity';
import { CreateEnvironmentDto } from '../dto/create-environment.dto';
import { UpdateEnvironmentDto } from '../dto/update-environment.dto';
import { Environment } from '../entities/environment.entity';

export interface IEnvironmentService {
  create(createEnvironmentDto: CreateEnvironmentDto, image?: Express.Multer.File): Promise<{ message: string }>;
  count(): Promise<number>;
  findAll(status: string): Promise<Environment[]>;
  findOne(id: string): Promise<Environment>;
  findEnvReservationsById(id: string): Promise<EnvReservation[]>;
  update(id: string, updateEnvironmentDto: UpdateEnvironmentDto, image?: Express.Multer.File): Promise<Environment>;
  remove(id: string): Promise<{ message: string }>;
}

export const IEnvironmentService = Symbol('IEnvironmentService');
