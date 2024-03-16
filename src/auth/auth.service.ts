import { Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { IAuthService } from './interfaces/auth-service.interface';
import { IUserService } from 'src/users/interfaces/users-service.interface';
import { IGoogleOAuth } from './interfaces/google-oaut.interface';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService implements IAuthService {
  private googleOAuth2: OAuth2Client;
  constructor(
    @Inject(forwardRef(() => IUserService)) private readonly usersService: IUserService,
    private jwtService: JwtService,
  ) {
    this.googleOAuth2 = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
  }

  async login(authCredentialsDto: AuthCredentialsDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findToLogin(authCredentialsDto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!(await bcrypt.compare(authCredentialsDto.password, user.password)))
      throw new UnauthorizedException('Invalid credentials');
    delete user.password;
    const payload: JwtPayload = { user };
    return { access_token: this.jwtService.sign(payload) };
  }

  async googleLogin(credential: IGoogleOAuth): Promise<{ access_token: string }> {
    const ticket = await this.googleOAuth2.verifyIdToken({
      idToken: credential.token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const user = await this.usersService.findOneByEmail(ticket.getPayload().email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const payload: JwtPayload = { user };
    return { access_token: this.jwtService.sign(payload) };
  }
}
