import { CreateEnvironmentDto } from '../dto/create-environment.dto';
import { UpdateEnvironmentDto } from '../dto/update-environment.dto';
import { Environment } from '../entities/environment.entity';

export interface IEnvironmentService {
  findAll(status: string): Promise<Environment[]>;
  findOne(id: string): Promise<Environment>;
  update(id: string, updateEnvironmentDto: UpdateEnvironmentDto): Promise<Environment>;
  create(createEnvironmentDto: CreateEnvironmentDto): Promise<Environment>;
  remove(id: string): Promise<any>;
}

export const IEnvironmentService = Symbol('IEnvironmentService');
