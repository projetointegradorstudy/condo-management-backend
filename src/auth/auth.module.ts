import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from './roles/roles.guard';
import { IAuthService } from './interfaces/auth-service.interface';
import { IUserService } from 'src/users/interfaces/users-service.interface';
import { UsersService } from 'src/users/users.service';
import { IUserRepository } from 'src/users/interfaces/users-repository.interface';
import { UsersRepository } from 'src/users/users.repository';
import { IS3Service } from 'src/utils/upload/s3.interface';
import { S3Service } from 'src/utils/upload/s3.service';
import { IEmailService } from 'src/utils/email/email.interface';
import { EmailService } from 'src/utils/email/email.service';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

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
  providers: [
    {
      provide: IAuthService,
      useClass: AuthService,
    },
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
    AuthService,
    JwtStrategy,
    RolesGuard,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
