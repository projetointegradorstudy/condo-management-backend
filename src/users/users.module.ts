import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { EmailService } from 'src/utils/email/email.service';
import { CheckUUIDParam, EmailExists, PasswordsMatch } from 'src/utils/validations.middleware';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IUserService } from './interfaces/users-service.interface';
import { IUserRepository } from './interfaces/users-repository.interface';
import { S3Service } from 'src/utils/upload/s3.service';
import { IS3Service } from 'src/utils/upload/s3.interface';
import { IEmailService } from 'src/utils/email/email.interface';
import { IAuthService } from 'src/auth/interfaces/auth-service.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRET_KEY'),
        signOptions: { expiresIn: configService.get('EXPIRE_TIME') },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: IUserService,
      useClass: UsersService,
    },
    {
      provide: IUserRepository,
      useClass: UsersRepository,
    },
    {
      provide: IS3Service,
      useClass: S3Service,
    },
    {
      provide: IEmailService,
      useClass: EmailService,
    },
    {
      provide: IAuthService,
      useClass: AuthService,
    },
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PasswordsMatch)
      .forRoutes({ path: 'users/:token/create-password', method: RequestMethod.PATCH })
      .apply(EmailExists)
      .forRoutes({ path: 'users', method: RequestMethod.POST })
      .apply(CheckUUIDParam)
      .forRoutes({ path: 'users/:uuid?/env-requests', method: RequestMethod.PATCH });
  }
}
