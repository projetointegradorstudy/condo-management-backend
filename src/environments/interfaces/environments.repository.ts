import { DeleteResult } from 'typeorm';
import { CreateEnvironmentDto } from '../dto/create-environment.dto';
import { UpdateEnvironmentDto } from '../dto/update-environment.dto';
import { Environment } from '../entities/environment.entity';
import { Status } from '../entities/status.enum';

export interface IEnvironmentRepository {
  createEnvironment(createEnvironmentDto: CreateEnvironmentDto): Promise<Environment>;
  findById(id: string): Promise<Environment>;
  updateEnvironment(id: string, updateEnvironmentDto: UpdateEnvironmentDto): Promise<Environment>;
  findEnvironments(status: Status): Promise<Environment[]>;
  delete(id: string): Promise<DeleteResult>;
}

export const IEnvironmentRepository = Symbol('IEnvironmentRepository');
