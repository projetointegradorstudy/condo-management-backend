import { Controller, Post, Body, Inject, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { IAuthService } from './interfaces/auth-service.interface';
import { IFacebookOAuth, IGoogleOAuth, IMicrosoftOAuth } from './interfaces/oauts.interface';
import { MfaCredentialsDto } from './dto/mfa-credentials.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject(IAuthService) private readonly authService: IAuthService) {}

  @Post()
  @ApiOperation({ summary: 'Login' })
  @ApiCreatedResponse({
    description: 'User authenticated successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 401,
        },
        message: {
          type: 'string',
          default: 'Invalid credentials',
        },
        error: {
          type: 'string',
          default: 'Unauthorized',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 400,
        },
        message: {
          type: 'string',
          default: 'Example error message',
        },
        error: {
          type: 'string',
          default: 'Bad Request',
        },
      },
    },
  })
  async login(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ access_token: string }> {
    return this.authService.login(authCredentialsDto);
  }

  @Post('mfa-auth')
  @ApiOperation({ summary: 'Login Mfa' })
  @ApiCreatedResponse({
    description: 'User authenticated successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 401,
        },
        message: {
          type: 'string',
          default: 'Invalid credentials',
        },
        error: {
          type: 'string',
          default: 'Unauthorized',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 400,
        },
        message: {
          type: 'string',
          default: 'Example error message',
        },
        error: {
          type: 'string',
          default: 'Bad Request',
        },
      },
    },
  })
  async mfaTokenValidation(@Body() mfaCredentialsDto: MfaCredentialsDto): Promise<{ access_token: string }> {
    return this.authService.mfaTokenValidation(mfaCredentialsDto);
  }

  @Post('2fa-auth')
  @ApiOperation({ summary: 'Login two factor' })
  @ApiCreatedResponse({
    description: 'User authenticated successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 401,
        },
        message: {
          type: 'string',
          default: 'Invalid credentials',
        },
        error: {
          type: 'string',
          default: 'Unauthorized',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 400,
        },
        message: {
          type: 'string',
          default: 'Example error message',
        },
        error: {
          type: 'string',
          default: 'Bad Request',
        },
      },
    },
  })
  async loginWithTwoFactorAuth(@Body() credentials2faDto: MfaCredentialsDto): Promise<{ access_token: string }> {
    return this.authService.loginWithTwoFactorAuth(credentials2faDto);
  }

  @Post('2fa-validate')
  @ApiOperation({ summary: 'Validate code 2fa' })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 401,
        },
        message: {
          type: 'string',
          default: 'Invalid credentials',
        },
        error: {
          type: 'string',
          default: 'Unauthorized',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 400,
        },
        message: {
          type: 'string',
          default: 'Example error message',
        },
        error: {
          type: 'string',
          default: 'Bad Request',
        },
      },
    },
  })
  async twoFactorCodeValidate(@Body() credentials2faDto: MfaCredentialsDto): Promise<boolean> {
    return this.authService.isTwoFactorAuthCodeValid(credentials2faDto);
  }

  @Post('facebook')
  @ApiOperation({ summary: 'Facebook OAuth' })
  @ApiCreatedResponse({
    description: 'User authenticated successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 401,
        },
        message: {
          type: 'string',
          default: 'Invalid credentials',
        },
        error: {
          type: 'string',
          default: 'Unauthorized',
        },
      },
    },
  })
  async facebookLogin(@Body() credential: IFacebookOAuth): Promise<{ access_token: string }> {
    return this.authService.facebookLogin(credential);
  }

  @Post('google')
  @ApiOperation({ summary: 'Google OAuth' })
  @ApiCreatedResponse({
    description: 'User authenticated successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 401,
        },
        message: {
          type: 'string',
          default: 'Invalid credentials',
        },
        error: {
          type: 'string',
          default: 'Unauthorized',
        },
      },
    },
  })
  async googleLogin(@Body() credential: IGoogleOAuth): Promise<{ access_token: string }> {
    return this.authService.googleLogin(credential);
  }

  @Post('microsoft')
  @ApiOperation({ summary: 'Google OAuth' })
  @ApiCreatedResponse({
    description: 'User authenticated successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 401,
        },
        message: {
          type: 'string',
          default: 'Invalid credentials',
        },
        error: {
          type: 'string',
          default: 'Unauthorized',
        },
      },
    },
  })
  async microsoftLogin(@Body() credential: IMicrosoftOAuth): Promise<{ access_token: string }> {
    return this.authService.microsoftLogin(credential);
  }
}
