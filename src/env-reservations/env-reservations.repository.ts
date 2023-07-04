import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnvReservation } from './entities/env-reservation.entity';
import { IEnvReservationRepository } from './interfaces/env-reservations-repository.interface';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class EnvReservationRepository extends BaseRepository<EnvReservation> implements IEnvReservationRepository {
  constructor(
    @InjectRepository(EnvReservation)
    private readonly envRequestRepository: Repository<EnvReservation>,
  ) {
    super(envRequestRepository);
  }
}
