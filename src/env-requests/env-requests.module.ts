import { Module } from '@nestjs/common';
import { EnvRequestsService } from './env-requests.service';
import { EnvRequestsController } from './env-requests.controller';
import { EnvRequest } from './entities/env-request.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvRequestRepository } from './env-requests.repository';
import { IEnvRequestService } from './interfaces/env-requests-service.interface';
import { IEnvRequestRepository } from './interfaces/env-requests-repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([EnvRequest])],
  controllers: [EnvRequestsController],
  providers: [
    {
      provide: IEnvRequestService,
      useClass: EnvRequestsService,
    },
    {
      provide: IEnvRequestRepository,
      useClass: EnvRequestRepository,
    },
  ],
})
export class EnvRequestsModule {}
