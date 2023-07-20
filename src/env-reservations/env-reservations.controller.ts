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
  Req,
} from '@nestjs/common';
import { UpdateEnvReservationDto } from './dto/update-env-reservations.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { CreateEnvReservationDto } from './dto/create-env-reservations.dto';
import { IEnvReservationService } from './interfaces/env-reservations-service.interface';
import { EnvReservationStatus } from './entities/status.enum';
import { EnvReservation } from './entities/env-reservation.entity';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';

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
@ApiTags('Env_Reservations')
@Controller('env-reservations')
export class EnvReservationsController {
  constructor(@Inject(IEnvReservationService) private readonly envRequestsService: IEnvReservationService) {}

  @Post()
  @ApiOperation({ summary: 'Create' })
  @ApiCreatedResponse({
    description: 'Reservation created successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Reservation created successfully',
        },
      },
    },
  })
  @ApiConflictResponse({
    description: 'Environment unavailable',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          default: 409,
        },
        message: {
          type: 'string',
          default: 'Environment unavailable',
        },
        error: {
          type: 'string',
          default: 'Conflict',
        },
      },
    },
  })
  create(@Body() createEnvReservationDto: CreateEnvReservationDto, @Req() req: any) {
    return this.envRequestsService.create(createEnvReservationDto, req.user.user.id);
  }

  @Get('count')
  @ApiOperation({ summary: 'Count' })
  @ApiOkResponse({
    description: 'Counted successfully',
    schema: {
      type: 'number',
      example: 5,
    },
  })
  count() {
    return this.envRequestsService.count();
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'FindAll' })
  @ApiQuery({
    name: 'status',
    enum: EnvReservationStatus,
    description: 'Reservation status',
    required: false,
  })
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
          default: 'Invalid reservation status',
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
  findAll(@Query('status') status?: string) {
    return this.envRequestsService.findAll(status);
  }

  @Get('user')
  @ApiOperation({ summary: 'FindAllByUser' })
  @ApiQuery({
    name: 'status',
    enum: EnvReservationStatus,
    description: 'Reservation status',
    required: false,
  })
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
          default: 'Invalid reservation status',
        },
        error: {
          type: 'string',
          default: 'Bad Request',
        },
      },
    },
  })
  findAllByUser(@Req() req: any, @Query('status') status?: string) {
    return this.envRequestsService.findAllByUser(req.user.user.id, status);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'FindOne' })
  @ApiOkResponse({
    description: 'A reservation',
    type: EnvReservation,
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
    description: 'Reservation not found',
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
    return this.envRequestsService.findOne(uuid);
  }

  @Patch(':uuid')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update' })
  @ApiOkResponse({
    description: 'An updated reservation',
    type: EnvReservation,
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
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateEnvironmentDto: UpdateEnvReservationDto,
    @Req() req: any,
  ) {
    return this.envRequestsService.update(uuid, updateEnvironmentDto, req.user.user);
  }

  @Delete(':uuid')
  @Roles(Role.ADMIN)
  @ApiOkResponse({
    description: 'The reservation have been removed',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Reservation deleted successfully',
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
  @ApiOperation({ summary: 'SoftDelete' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.envRequestsService.remove(uuid);
  }
}
