import {
  BadRequestException,
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { Repository } from 'typeorm';
import { EmailService } from './email/email.service';
import { User } from 'src/users/entities/user.entity';
import { IEmailService } from './email/email.interface';
import { EnvironmentStatus } from 'src/environments/entities/status.enum';
import { EnvReservationStatus } from 'src/env-reservations/entities/status.enum';

const checkUUID = (field: string): void => {
  if (!isUUID(field)) throw new HttpException({ error: `Must be a valid UUID` }, 400);
};

@Injectable()
export class CheckUUIDParam implements NestMiddleware {
  async use(req: Request, _res: Response, next: NextFunction) {
    if (req.params.uuid) checkUUID(req.params.uuid);
    next();
  }
}

@Injectable()
export class PasswordsMatch implements NestMiddleware {
  async use(req: Request, _res: Response, next: NextFunction) {
    if (req.body.password && req.body.password !== req.body.passwordConfirmation)
      throw new BadRequestException("Passwords doesn't match");
    next();
  }
}

@Injectable()
export class EmailExists implements NestMiddleware {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(IEmailService) private readonly emailService: EmailService,
  ) {}
  async use(req: Request, _res: Response, next: NextFunction) {
    if (req.body.email) {
      const emailExist = await this.userRepository.findOne({ where: { email: req.body.email }, withDeleted: true });
      if (emailExist && emailExist.is_active) throw new ConflictException("There's an email conflict");
      if (emailExist && !emailExist.is_active) {
        await this.emailService.sendEmail(emailExist, 'Create-password');
        await this.userRepository.save(emailExist);
        throw new HttpException(
          {
            message: 'This email exist on our databases, an email for setting password will be sent',
          },
          200,
        );
      }
    }
    next();
  }
}

@Injectable()
export class ValidateEnvironmentStatus implements NestMiddleware {
  async use(req: Request, _res: Response, next: NextFunction) {
    if (req.query.status) {
      if (!Object.values(EnvironmentStatus).includes(req.query.status as EnvironmentStatus))
        throw new BadRequestException('Invalid environment status');
    }
    next();
  }
}

@Injectable()
export class ValidateEnvReservationStatus implements NestMiddleware {
  async use(req: Request, _res: Response, next: NextFunction) {
    if (req.query.status) {
      if (!Object.values(EnvReservationStatus).includes(req.query.status as EnvReservationStatus))
        throw new BadRequestException('Invalid reservation status');
    }
    next();
  }
}
