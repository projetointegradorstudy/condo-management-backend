import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { IGoogleOAuth } from './google-oaut.interface';

export interface IAuthService {
  login(authCredentialsDto: AuthCredentialsDto): Promise<{ access_token: string }>;
  googleLogin(credential: IGoogleOAuth): Promise<{ access_token: string }>;
}

export const IAuthService = Symbol('IAuthService');
