import { BadRequestException, ConflictException, HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { Repository } from 'typeorm';
import { EmailService } from './email.service';
import { User } from 'src/users/entities/user.entity';

function checkUUID(field: string): void {
  if (!isUUID(field)) throw new HttpException({ error: `Must be a valid UUID` }, 200);
}

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

// @Injectable()
// export class PinsMatch implements NestMiddleware {
//   async use(req: Request, _res: Response, next: NextFunction) {
//     if (req.body.pin && req.body.pin !== req.body.pinConfirmation)
//       throw new HttpException({ error: "Pin doesn't match" }, 200);
//     next();
//   }
// }

@Injectable()
export class EmailExists implements NestMiddleware {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly emailService: EmailService,
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
            message: 'This email exist on our databases, an email with confirmate instructions will be sent',
          },
          200,
        );
      }
    }
    next();
  }
}

// @Injectable()
// export class UserExists implements NestMiddleware {
//   constructor(@InjectRepository(User) private userRepository: Repository<User>) {}
//   async use(req: Request, _res: Response, next: NextFunction) {
//     if (req.body.owner_user) {
//       checkUUID(req.body.owner_user);
//       const userExist = await this.userRepository.findOne({ external_id: req.body.owner_user });
//       if (!userExist) throw new HttpException({ error: 'Not found' }, 200);
//     }
//     next();
//   }
// }

// @Injectable()
// export class DonationUserExists implements NestMiddleware {
//   constructor(@InjectRepository(User) private userRepository: Repository<User>) {}
//   async use(req: Request, _res: Response, next: NextFunction) {
//     if (req.body.destinatary_user || req.body.owner_user) {
//       checkUUID(req.body.destinatary_user || req.body.owner_user);
//       const userExist = await this.userRepository.findOne({
//         external_id: req.body.destinatary_user ?? req.body.owner_user,
//       });
//       if (!userExist) throw new HttpException({ error: 'Not found' }, 200);
//     }
//     next();
//   }
// }

// @Injectable()
// export class DonationExists implements NestMiddleware {
//   constructor(@InjectRepository(Donation) private donationRepository: Repository<Donation>) {}
//   async use(req: Request, _res: Response, next: NextFunction) {
//     if (req.body.donation_id) {
//       checkUUID(req.body.donation_id);
//       const donationExist = await this.donationRepository.findOne({
//         external_id: req.body.donation_id,
//       });
//       if (!donationExist) throw new HttpException({ error: 'Donation not found' }, 200);
//     }
//     next();
//   }
// }

// @Injectable()
// export class PayerExistToPayment implements NestMiddleware {
//   constructor(@InjectRepository(User) private userRepository: Repository<User>) {}
//   async use(req: Request, _res: Response, next: NextFunction) {
//     if (req.body.payer_id) {
//       checkUUID(req.body.payer_id);
//       const userExist = await this.userRepository.findOne({
//         external_id: req.body.payer_id,
//       });
//       if (!userExist) throw new HttpException({ error: 'Payer not found' }, 200);
//     }
//     next();
//   }
// }

// @Injectable()
// export class MinTransactionsValue implements NestMiddleware {
//   async use(req: Request, _res: Response, next: NextFunction) {
//     if (req.body.value || req.query.value) {
//       const minValue = +process.env.MIN_TRANSACTION_VALUE;
//       const typedValue = +req.body.value || +req.query.value;
//       if (!!(typedValue % minValue) || typedValue < minValue)
//         throw new HttpException({ error: `Value must be higher and multiple of ${minValue}` }, 200);
//     }
//     next();
//   }
// }

// @Injectable()
// export class OwnerBalanceExists implements NestMiddleware {
//   constructor(@InjectRepository(Balance) private balanceRepository: Repository<Balance>) {}
//   async use(req: Request, _res: Response, next: NextFunction) {
//     if (req.body.owner_user) {
//       checkUUID(req.body.owner_user);
//       const ownerBalance = await this.balanceRepository.findOne({ owner_user: req.body.owner_user });
//       if (ownerBalance) throw new HttpException({ error: 'This user already has a balance' }, 200);
//     }
//     next();
//   }
// }
