import {
  Inject,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  UseGuards,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';
import { IEnvironmentService } from './interfaces/environments-service.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { FormData } from 'src/decorators/form-data.decorator';
import { fileMimetypeFilter } from 'src/utils/file-mimetype-filter';
import { ParseFile } from 'src/utils/parse-file.pipe';
import { EnvironmentStatus } from './entities/status.enum';
import { Environment } from './entities/environment.entity';
import { EnvReservation } from 'src/env-reservations/entities/env-reservation.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
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
@ApiTags('Environments')
@Controller('environments')
export class EnvironmentsController {
  constructor(@Inject(IEnvironmentService) private readonly environmentsService: IEnvironmentService) {}

  @Post()
  @Roles(Role.ADMIN)
  @FormData(['image', 'name', 'description', 'capacity'], true, {
    fileFilter: fileMimetypeFilter('png', 'jpg', 'jpeg'),
    limits: { fileSize: 5242880 /** <- 5mb */ },
  })
  @ApiOperation({ summary: 'Create' })
  @ApiCreatedResponse({
    description: 'Environment created successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Environment created successfully',
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
  @ApiUnsupportedMediaTypeResponse({
    description: 'Forbidden request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 415,
        },
        message: {
          type: 'string',
          default: `File type is not matching: 'png', 'jpg', 'jpeg'}`,
        },
        error: {
          type: 'string',
          default: 'Unsupported Media Type',
        },
      },
    },
  })
  @ApiBody({ type: CreateEnvironmentDto })
  create(@Body() createEnvironmentDto: CreateEnvironmentDto, @UploadedFile(ParseFile) image?: Express.Multer.File) {
    return this.environmentsService.create(createEnvironmentDto, image);
  }

  @Get('count')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Count' })
  @ApiQuery({
    name: 'status',
    enum: EnvironmentStatus,
    description: 'Environment status',
    required: false,
  })
  @ApiOkResponse({
    description: 'Counted successfully',
    schema: {
      type: 'number',
      example: 5,
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
          default: 'Invalid environment status',
        },
        error: {
          type: 'string',
          default: 'Bad Request',
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
  count(@Query('status') status?: EnvironmentStatus) {
    return this.environmentsService.count(status);
  }

  @Get()
  @ApiOperation({ summary: 'FindAll' })
  @ApiOkResponse({
    description: 'An array of environments',
    type: Environment,
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
          default: 'Invalid environment status',
        },
        error: {
          type: 'string',
          default: 'Bad Request',
        },
      },
    },
  })
  @ApiQuery({
    name: 'status',
    enum: EnvironmentStatus,
    description: 'Environments status to find',
    required: false,
  })
  findAll(@Req() req: any, @Query('status') status?: EnvironmentStatus) {
    return this.environmentsService.findAll(req.user.user, status);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'FindOne' })
  @ApiOkResponse({
    description: 'An environment',
    type: Environment,
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
  @ApiNotFoundResponse({
    description: 'Enviroment not found',
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
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.environmentsService.findOne(uuid);
  }

  @Get(':uuid?/env-reservations')
  @ApiOperation({ summary: 'FindEnvReservationsById' })
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
          default: 'Validation failed (uuid is expected)',
        },
        error: {
          type: 'string',
          default: 'Bad Request',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Enviroment not found',
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
  findEnvReservationsById(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.environmentsService.findEnvReservationsById(uuid);
  }

  @Patch(':uuid')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update' })
  @ApiOkResponse({
    description: 'An updated environment',
    type: Environment,
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
  @ApiUnsupportedMediaTypeResponse({
    description: 'Forbidden request',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 415,
        },
        message: {
          type: 'string',
          default: `File type is not matching: 'png', 'jpg', 'jpeg'}`,
        },
        error: {
          type: 'string',
          default: 'Unsupported Media Type',
        },
      },
    },
  })
  @FormData(['image', 'name', 'description', 'status', 'capacity'], false, {
    fileFilter: fileMimetypeFilter('png', 'jpg', 'jpeg'),
    limits: { fileSize: 5242880 /** <- 5mb */ },
  })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateEnvironmentDto: UpdateEnvironmentDto,
    @UploadedFile(ParseFile) image?: Express.Multer.File,
  ) {
    return this.environmentsService.update(uuid, updateEnvironmentDto, image);
  }

  @Delete(':uuid')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'SoftDelete' })
  @ApiOkResponse({
    description: 'The environment have been removed',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Environment deleted successfully',
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
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.environmentsService.remove(uuid);
  }
}
