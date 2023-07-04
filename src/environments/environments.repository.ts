import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Environment } from './entities/environment.entity';
import { IEnvironmentRepository } from './interfaces/environments-repository.interface';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class EnvironmentRepository extends BaseRepository<Environment> implements IEnvironmentRepository {
  constructor(
    @InjectRepository(Environment)
    private readonly environmentRepository: Repository<Environment>,
  ) {
    super(environmentRepository);
  }
}
