import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async login(authCredentialsDto: AuthCredentialsDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findToLogin(authCredentialsDto.email);
    if (!user) throw new UnauthorizedException('Wrong email');
    if (!(await bcrypt.compare(authCredentialsDto.password, user.password)))
      throw new UnauthorizedException('Invalid credentials');
    delete user.password;
    const payload: JwtPayload = { user };
    return { access_token: this.jwtService.sign(payload) };
  }
}
