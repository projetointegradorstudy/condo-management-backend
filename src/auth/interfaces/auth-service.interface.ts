import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { IFacebookOAuth, IGoogleOAuth } from './oauts.interface';

export interface IAuthService {
  login(authCredentialsDto: AuthCredentialsDto): Promise<{ access_token: string }>;
  googleLogin(credential: IGoogleOAuth): Promise<{ access_token: string }>;
  facebookLogin(credential: IFacebookOAuth): Promise<{ access_token: string }>;
}

export const IAuthService = Symbol('IAuthService');
