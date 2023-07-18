import { AuthController } from './auth.controller';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { IAuthService } from './interfaces/auth-service.interface';

describe('AuthController', () => {
  let authController: AuthController;
  let mockAuthService: jest.Mocked<IAuthService>;

  beforeEach(() => {
    mockAuthService = {
      login: jest.fn(),
    } as unknown as jest.Mocked<IAuthService>;

    authController = new AuthController(mockAuthService);
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const credentials: AuthCredentialsDto = { email: 'john_doo@contoso.com', password: '123456' };

      jest.spyOn(mockAuthService, 'login').mockResolvedValueOnce({ access_token: 'g75sdg756sd4g68sd4g68' });

      const result = await authController.login(credentials);

      expect(mockAuthService.login).toHaveBeenCalledWith(credentials);
      expect(result).toEqual({ access_token: 'g75sdg756sd4g68sd4g68' });
    });
  });
});
