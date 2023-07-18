import { AuthCredentialsDto } from '../dto/auth-credentials.dto';

export interface IAuthService {
  login(authCredentialsDto: AuthCredentialsDto): Promise<{ access_token: string }>;
}

export const IAuthService = Symbol('IAuthService');
