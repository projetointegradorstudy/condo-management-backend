import { Controller, Post, Body, Inject } from '@nestjs/common';
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
  async mfaTokenValidation(@Body() mfaCredentialsDto: MfaCredentialsDto): Promise<any> {
    return this.authService.mfaTokenValidation(mfaCredentialsDto);
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
