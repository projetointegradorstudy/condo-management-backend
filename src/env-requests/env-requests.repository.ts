import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnvRequest } from './entities/env-request.entity';
import { IEnvRequestRepository } from './interfaces/env-requests.repository';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/base-entity/base-entity.repository';

@Injectable()
export class EnvRequestRepository extends BaseRepository<EnvRequest> implements IEnvRequestRepository {
  constructor(
    @InjectRepository(EnvRequest)
    private readonly envRequestRepository: Repository<EnvRequest>,
  ) {
    super(envRequestRepository);
  }
}
