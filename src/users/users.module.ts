import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { EmailService } from 'src/utils/email.service';
import { EmailExists, PasswordsMatch } from 'src/utils/validations.middleware';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
  controllers: [UserController],
  providers: [UsersService, UsersRepository, EmailService, AuthService],
  exports: [UsersService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PasswordsMatch)
      .forRoutes({ path: 'users/:token/create-password', method: RequestMethod.PATCH })
      .apply(EmailExists)
      .forRoutes({ path: 'users', method: RequestMethod.POST });
  }
}
