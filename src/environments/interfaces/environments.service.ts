import { CreateEnvironmentDto } from '../dto/create-environment.dto';
import { UpdateEnvironmentDto } from '../dto/update-environment.dto';
import { Environment } from '../entities/environment.entity';

export interface IEnvironmentService {
  create(createEnvironmentDto: CreateEnvironmentDto): Promise<Environment>;
  findAll(status: string): Promise<Environment[]>;
  findOne(id: string): Promise<Environment>;
  update(id: string, updateEnvironmentDto: UpdateEnvironmentDto): Promise<Environment>;
  remove(id: string): Promise<{ message: string }>;
}

export const IEnvironmentService = Symbol('IEnvironmentService');
