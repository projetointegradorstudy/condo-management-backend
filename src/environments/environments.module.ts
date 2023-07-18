import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { EnvironmentsService } from './environments.service';
import { EnvironmentsController } from './environments.controller';
import { Environment } from './entities/environment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentRepository } from './environments.repository';
import { IEnvironmentService } from './interfaces/environments-service.interface';
import { IEnvironmentRepository } from './interfaces/environments-repository.interface';
import { S3Service } from 'src/utils/upload/s3.service';
import { IS3Service } from 'src/utils/upload/s3.interface';
import { ValidateEnvironmentStatus } from 'src/utils/validations.middleware';

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
    {
      provide: IS3Service,
      useClass: S3Service,
    },
  ],
})
export class EnvironmentsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateEnvironmentStatus).forRoutes({ path: 'environments', method: RequestMethod.GET });
  }
}
