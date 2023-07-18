import { Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { IAuthService } from './interfaces/auth-service.interface';
import { IUserService } from 'src/users/interfaces/users-service.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(forwardRef(() => IUserService)) private readonly usersService: IUserService,
    private jwtService: JwtService,
  ) {}

  async login(authCredentialsDto: AuthCredentialsDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findToLogin(authCredentialsDto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!(await bcrypt.compare(authCredentialsDto.password, user.password)))
      throw new UnauthorizedException('Invalid credentials');
    delete user.password;
    const payload: JwtPayload = { user };
    return { access_token: this.jwtService.sign(payload) };
  }
}
