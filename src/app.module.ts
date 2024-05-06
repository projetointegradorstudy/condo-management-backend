import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EnvironmentsModule } from './environments/environments.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EnvReservationsModule } from './env-reservations/env-reservations.module';
import { dataSourceOptions } from './db/data-source';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({ validate, isGlobal: true, cache: true }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOptions),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          name: process.env.MAIN_EMAIL_DOMAIN,
          host: process.env.MAIN_EMAIL_HOST,
          port: +process.env.MAIN_EMAIL_PORT,
          auth: {
            user: process.env.MAIN_EMAIL,
            pass: process.env.MAIN_EMAIL_PASSWORD,
          },
        },
        defaults: {
          from: '"no-reply@condo-management.com" <no.reply.condo.management@gmail.com>',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
        },
      }),
    }),
    AuthModule,
    EnvReservationsModule,
    EnvironmentsModule,
    UsersModule,
  ],
})
export class AppModule {}
