import { CreateEnvRequestDto } from '../dto/create-env-request.dto';
import { UpdateEnvRequestDto } from '../dto/update-env-request.dto';
import { EnvRequest } from '../entities/env-request.entity';

export interface IEnvRequestService {
  create(createEnvRequestDto: CreateEnvRequestDto, id: string): Promise<EnvRequest>;
  count(): Promise<number>;
  findAll(status: string): Promise<EnvRequest[]>;
  findOne(id: string): Promise<EnvRequest>;
  update(id: string, updateEnvRequestDto: UpdateEnvRequestDto, image?: Express.Multer.File): Promise<EnvRequest>;
  remove(id: string): Promise<{ message: string }>;
}

export const IEnvRequestService = Symbol('IEnvRequestService');
