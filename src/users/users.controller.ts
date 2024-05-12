import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Req,
  Inject,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserPasswordDto } from './dto/create-user-password.dto';
import { IUserService } from './interfaces/users-service.interface';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { FormData } from 'src/decorators/form-data.decorator';
import { fileMimetypeFilter } from 'src/utils/file-mimetype-filter';
import { ParseFile } from 'src/utils/parse-file.pipe';
import { User } from './entities/user.entity';
import { EnvReservation } from 'src/env-reservations/entities/env-reservation.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(@Inject(IUserService) private readonly usersService: IUserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create' })
  @ApiOkResponse({
    description: 'Ok response',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Example response message',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'User created successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User created successfully',
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
          default: 'Example message error',
        },
        error: {
          type: 'string',
          default: 'Bad Request',
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
          default: 'Unauthorized',
        },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 403,
        },
        message: {
          type: 'string',
          default: 'Forbidden resource',
        },
        error: {
          type: 'string',
          default: 'Forbidden',
        },
      },
    },
  })
  @ApiConflictResponse({
    description: 'Email conflict',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 409,
        },
        message: {
          type: 'string',
          default: "There's an email conflict",
        },
        error: {
          type: 'string',
          default: 'Conflict',
        },
      },
    },
  })
  create(@Body() adminCreateUserDto: AdminCreateUserDto) {
    return this.usersService.create(adminCreateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Get('count')
  @ApiOperation({ summary: 'Count' })
  @ApiOkResponse({
    description: 'Counted successfully',
    schema: {
      type: 'number',
      example: 5,
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
          default: 'Unauthorized',
        },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 403,
        },
        message: {
          type: 'string',
          default: 'Forbidden resource',
        },
        error: {
          type: 'string',
          default: 'Forbidden',
        },
      },
    },
  })
  count() {
    return this.usersService.count();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'FindAll' })
  @ApiOkResponse({
    description: 'An array of users',
    type: User,
    isArray: true,
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
          default: 'Unauthorized',
        },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 403,
        },
        message: {
          type: 'string',
          default: 'Forbidden resource',
        },
        error: {
          type: 'string',
          default: 'Forbidden',
        },
      },
    },
  })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Get('admin/:uuid')
  @ApiOperation({ summary: 'FindOneByAdmin' })
  @ApiOkResponse({
    description: 'An user',
    type: User,
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
          default: 'Validation failed (uuid is expected)',
        },
        error: {
          type: 'string',
          default: 'Bad Request',
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
          default: 'Unauthorized',
        },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 403,
        },
        message: {
          type: 'string',
          default: 'Forbidden resource',
        },
        error: {
          type: 'string',
          default: 'Forbidden',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 404,
        },
        message: {
          type: 'string',
          default: 'Not Found',
        },
      },
    },
  })
  findOneByAdmin(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.findOne(uuid);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('myself')
  @ApiOperation({ summary: 'FindMyself' })
  @ApiOkResponse({
    description: 'An user',
    type: User,
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
          default: 'Unauthorized',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 404,
        },
        message: {
          type: 'string',
          default: 'Not Found',
        },
      },
    },
  })
  findOne(@Req() req: any) {
    return this.usersService.findOne(req.user.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':uuid?/env-reservations')
  @ApiOperation({ summary: 'FindUserReservations' })
  @ApiOkResponse({
    description: 'An array of reservations',
    type: EnvReservation,
    isArray: true,
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
          default: 'Must be a valid UUID',
        },
        error: {
          type: 'string',
          default: 'Bad Request',
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
          default: 'Unauthorized',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 404,
        },
        message: {
          type: 'string',
          default: 'Not Found',
        },
      },
    },
  })
  findUserReservations(@Param('uuid') uuid: string, @Req() req: any) {
    return this.usersService.findEnvReservationsById(uuid || req.user.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Patch('admin/:uuid/update')
  @ApiOperation({ summary: 'UpdateByAdmin' })
  @ApiOkResponse({
    description: 'An updated user',
    type: User,
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
          default: 'Unauthorized',
        },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 403,
        },
        message: {
          type: 'string',
          default: 'Forbidden resource',
        },
        error: {
          type: 'string',
          default: 'Forbidden',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 404,
        },
        message: {
          type: 'string',
          default: 'Not Found',
        },
      },
    },
  })
  updateByAdmin(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() adminUpdateUserDto: AdminUpdateUserDto) {
    return this.usersService.updateByAdmin(uuid, adminUpdateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Patch('myself/update')
  @ApiOperation({ summary: 'UpdateMyself' })
  @ApiOkResponse({
    description: 'An updated user',
    type: User,
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
          default: "Passwords doesn't match",
        },
        error: {
          type: 'string',
          default: 'Bad Request',
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
          default: 'Unauthorized',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 404,
        },
        message: {
          type: 'string',
          default: 'Not Found',
        },
      },
    },
  })
  @FormData(['avatar', 'name', 'password', 'passwordConfirmation', 'mfaOption'], false, {
    fileFilter: fileMimetypeFilter('png', 'jpg', 'jpeg'),
    limits: { fileSize: 5242880 /** <- 5mb */ },
  })
  @ApiBody({ required: false, type: UpdateUserDto })
  update(@Req() req: any, @Body() updateUserDto: UpdateUserDto, @UploadedFile(ParseFile) image?: Express.Multer.File) {
    return this.usersService.update(req.user.user.id, updateUserDto, image);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Patch('myself/enable-2fa')
  @ApiOperation({ summary: 'Enable 2FA' })
  @ApiOkResponse({
    description: 'Ok response',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: '2FA enabled successfully',
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
          default: 'Unauthorized',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 404,
        },
        message: {
          type: 'string',
          default: 'Not Found',
        },
      },
    },
  })
  update2FaAuth(@Req() req: any) {
    return this.usersService.turnOnTwoFactorAuth(req.user.user.id);
  }

  @Patch(':token/create-password')
  @ApiOperation({ summary: 'CreatePassword' })
  @ApiOkResponse({
    description: 'Password created successfully',
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
          default: "Passwords doesn't match",
        },
        error: {
          type: 'string',
          default: 'Bad Request',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 404,
        },
        message: {
          type: 'string',
          default: 'Not Found',
        },
      },
    },
  })
  createPassword(@Param('token') token: string, @Body() createUserPasswordDto: CreateUserPasswordDto) {
    return this.usersService.createPassword(token, createUserPasswordDto);
  }

  @Patch('send-reset-email')
  @ApiOperation({ summary: 'SendResetPasswordEmail' })
  @ApiOkResponse({
    description: 'An email will be sent',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'An email with recovery password instructions will be sent',
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
          default: `There are something wrong in email's smtp`,
        },
        error: {
          type: 'string',
          default: 'Bad Request',
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
      },
    },
  })
  sendResetPassEmail(@Query('email') email: string) {
    return this.usersService.sendResetPassEmail(email);
  }

  @Patch('reset-password')
  @ApiOperation({ summary: 'ResetPassword' })
  @ApiOkResponse({
    description: 'Password created successfully',
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
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 404,
        },
        message: {
          type: 'string',
          default: 'Invalid token',
        },
      },
    },
  })
  resetPassword(@Query('token') token: string, @Body() resetPasswordDto: ResetPasswordDto) {
    return this.usersService.resetPassword(token, resetPasswordDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Delete(':uuid')
  @ApiOperation({ summary: 'SoftDelete' })
  @ApiOkResponse({
    description: 'The user have been removed',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User deleted successfully',
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
          default: 'Validation failed (uuid is expected)',
        },
        error: {
          type: 'string',
          default: 'Bad Request',
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
          default: 'Unauthorized',
        },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 403,
        },
        message: {
          type: 'string',
          default: 'Forbidden resource',
        },
        error: {
          type: 'string',
          default: 'Forbidden',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 404,
        },
        message: {
          type: 'string',
          default: 'Not Found',
        },
      },
    },
  })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.remove(uuid);
  }
}
