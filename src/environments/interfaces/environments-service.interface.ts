import { EnvReservation } from 'src/env-reservations/entities/env-reservation.entity';
import { CreateEnvironmentDto } from '../dto/create-environment.dto';
import { UpdateEnvironmentDto } from '../dto/update-environment.dto';
import { Environment } from '../entities/environment.entity';
import { EnvironmentStatus } from '../entities/status.enum';
import { User } from 'src/users/entities/user.entity';

export interface IEnvironmentService {
  create(createEnvironmentDto: CreateEnvironmentDto, image?: Express.Multer.File): Promise<{ message: string }>;
  count(status?: EnvironmentStatus): Promise<number>;
  findAll(user: Partial<User>, status?: EnvironmentStatus): Promise<Environment[]>;
  findOne(id: string): Promise<Environment>;
  findEnvReservationsById(id: string): Promise<EnvReservation[]>;
  update(id: string, updateEnvironmentDto: UpdateEnvironmentDto, image?: Express.Multer.File): Promise<Environment>;
  remove(id: string): Promise<{ message: string }>;
}

export const IEnvironmentService = Symbol('IEnvironmentService');
