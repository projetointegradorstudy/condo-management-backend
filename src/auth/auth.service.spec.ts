import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { IUserService } from 'src/users/interfaces/users-service.interface';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from 'src/users/entities/user.entity';
import { Role } from './roles/role.enum';
import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { IAuthService } from './interfaces/auth-service.interface';

describe('AuthService', () => {
  let authService: IAuthService;
  let userService: IUserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: IAuthService,
          useClass: AuthService,
        },
        {
          provide: IUserService,
          useValue: {
            findToLogin: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get<IAuthService>(IAuthService);
    userService = moduleRef.get<IUserService>(IUserService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should throw Unauthorized Exception when user not found', async () => {
      const authCredentialsDto: AuthCredentialsDto = { email: 'john_doo@contoso.com', password: '123456' };

      jest.spyOn(userService, 'findToLogin').mockResolvedValueOnce(undefined);

      await expect(authService.login(authCredentialsDto)).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw Unauthorized Exception when credentials are invalid', async () => {
      const authCredentialsDto: AuthCredentialsDto = { email: 'john_doo@contoso.com', password: '4896845' };
      const foundUser: User = new User({
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        name: 'name test',
        email: 'john_doo@contoso.com',
        role: Role.USER,
        is_active: true,
        password: '$2b$10$IuYmdagdxtVjv35SY.qI3.VLq80oD3UoESp3hBOYokq7.48H7b.eK',
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      });

      jest.spyOn(userService, 'findToLogin').mockResolvedValueOnce(foundUser);

      await expect(authService.login(authCredentialsDto)).rejects.toThrowError(UnauthorizedException);
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should return an access token', async () => {
      const credentials: AuthCredentialsDto = { email: 'john_doo@contoso.com', password: '123456' };
      const foundUser: User = new User({
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        name: 'name test',
        email: 'john_doo@contoso.com',
        role: Role.USER,
        is_active: true,
        password: '$2b$10$IuYmdagdxtVjv35SY.qI3.VLq80oD3UoESp3hBOYokq7.48H7b.eK',
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      });

      jest.spyOn(userService, 'findToLogin').mockResolvedValueOnce(foundUser);
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce('g75sdg756sd4g68sd4g68');

      const result = await authService.login(credentials);

      expect(userService.findToLogin).toHaveBeenCalledWith(credentials.email);
      expect(result).toEqual({ access_token: 'g75sdg756sd4g68sd4g68' });
    });
  });
});
