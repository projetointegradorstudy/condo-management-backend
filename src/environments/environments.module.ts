import { Module } from '@nestjs/common';
import { EnvironmentsService } from './environments.service';
import { EnvironmentsController } from './environments.controller';
import { Environment } from './entities/environment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentRepository } from './environments.repository';
import { IEnvironmentService } from './interfaces/environments.service';
import { IEnvironmentRepository } from './interfaces/environments.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Environment])],
  controllers: [EnvironmentsController],
  providers: [
    {
      provide: IEnvironmentService,
      useClass: EnvironmentsService,
    },
    {
      provide: IEnvironmentRepository,
      useClass: EnvironmentRepository,
    },
  ],
})
export class EnvironmentsModule {}
