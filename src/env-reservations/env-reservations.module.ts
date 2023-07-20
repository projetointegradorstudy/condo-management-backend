import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { EnvReservationsService } from './env-reservations.service';
import { EnvReservationsController } from './env-reservations.controller';
import { EnvReservation } from './entities/env-reservation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvReservationRepository } from './env-reservations.repository';
import { IEnvReservationService } from './interfaces/env-reservations-service.interface';
import { IEnvReservationRepository } from './interfaces/env-reservations-repository.interface';
import { ValidateEnvReservationStatus } from 'src/utils/validations.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([EnvReservation])],
  controllers: [EnvReservationsController],
  providers: [
    {
      provide: IEnvReservationService,
      useClass: EnvReservationsService,
    },
    {
      provide: IEnvReservationRepository,
      useClass: EnvReservationRepository,
    },
  ],
})
export class EnvReservationsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateEnvReservationStatus)
      .forRoutes(
        { path: 'env-reservations', method: RequestMethod.GET },
        { path: 'env-reservations/count', method: RequestMethod.GET },
        { path: 'env-reservations/user', method: RequestMethod.GET },
      );
  }
}
