import { BadRequestException, Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { IAuthService } from './interfaces/auth-service.interface';
import { IUserService } from 'src/users/interfaces/users-service.interface';
import { IFacebookOAuth, IGoogleOAuth, IMicrosoftOAuth } from './interfaces/oauts.interface';
import { OAuth2Client } from 'google-auth-library';
import { MfaCredentialsDto } from './dto/mfa-credentials.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { authenticator } from 'otplib';

@Injectable()
export class AuthService implements IAuthService {
  private googleOAuth2: OAuth2Client;
  constructor(
    @Inject(forwardRef(() => IUserService)) private readonly usersService: IUserService,
    private jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.googleOAuth2 = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
  }

  async login(authCredentialsDto: AuthCredentialsDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findToLogin(authCredentialsDto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!(await bcrypt.compare(authCredentialsDto.password, user.password)))
      throw new UnauthorizedException('Invalid credentials');
    if (user.mfaOption?.email) await this.usersService.sendMfaTokenByEmail(user);
    delete user.password;
    delete user.twoFactorAuthSecret;
    const payload: JwtPayload = { user };
    return { access_token: this.jwtService.sign(payload) };
  }

  async mfaTokenValidation(mfaCredentialsDto: MfaCredentialsDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findToLogin(mfaCredentialsDto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!(await bcrypt.compare(mfaCredentialsDto.token, user.partial_token)))
      throw new UnauthorizedException('Invalid credentials');
    delete user.password;
    delete user.twoFactorAuthSecret;
    this.eventEmitter.emit('clearToken', mfaCredentialsDto.email);
    const payload: JwtPayload = { user };
    return { access_token: this.jwtService.sign(payload) };
  }

  async loginWithTwoFactorAuth(credentials2faDto: MfaCredentialsDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findToLogin(credentials2faDto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    await this.isTwoFactorAuthCodeValid(credentials2faDto);
    delete user.password;
    delete user.twoFactorAuthSecret;
    const payload: JwtPayload = { user };
    return { access_token: this.jwtService.sign(payload) };
  }

  public async isTwoFactorAuthCodeValid(credentials2faDto: MfaCredentialsDto): Promise<boolean> {
    const user = await this.usersService.findToLogin(credentials2faDto.email);
    const isCodeValid = authenticator.verify({
      token: credentials2faDto.token || '',
      secret: user.twoFactorAuthSecret || '',
    });

    if (!isCodeValid) throw new UnauthorizedException('Invalid credentials');

    return true;
  }

  async facebookLogin(credential: IFacebookOAuth): Promise<{ access_token: string }> {
    fetch(`${process.env.FACEBOOK_URL_VERIFY_TOKEN}${credential.accessToken}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.id !== process.env.FACEBOOK_APP_ID) throw new UnauthorizedException('Invalid credentials');
      })
      .catch((e) => {
        throw new BadRequestException(e?.data?.response?.message || 'Bad Request');
      });

    const user = await this.usersService.findOneByEmail(credential.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const payload: JwtPayload = { user };
    return { access_token: this.jwtService.sign(payload) };
  }

  async googleLogin(credential: IGoogleOAuth): Promise<{ access_token: string }> {
    const ticket = await this.googleOAuth2.verifyIdToken({
      idToken: credential.accessToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const user = await this.usersService.findOneByEmail(ticket.getPayload().email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const payload: JwtPayload = { user };
    return { access_token: this.jwtService.sign(payload) };
  }

  async microsoftLogin(credential: IMicrosoftOAuth): Promise<{ access_token: string }> {
    if (!credential.accessToken) throw new UnauthorizedException('Invalid credentials');
    const user = await this.usersService.findOneByEmail(credential.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const payload: JwtPayload = { user };
    return { access_token: this.jwtService.sign(payload) };
  }
}
