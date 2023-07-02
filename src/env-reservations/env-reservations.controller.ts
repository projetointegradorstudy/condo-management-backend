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
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { CreateEnvReservationDto } from './dto/create-env-reservations.dto';
import { IEnvReservationService } from './interfaces/env-reservations-service.interface';
import { EnvReservationStatus } from './entities/status.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiTags('Env_Reservations')
@Controller('env-reservations')
export class EnvReservationsController {
  constructor(@Inject(IEnvReservationService) private readonly envRequestsService: IEnvReservationService) {}

  @Post()
  create(@Body() createEnvReservationDto: CreateEnvReservationDto, @Req() req: any) {
    return this.envRequestsService.create(createEnvReservationDto, req.user.user.id);
  }

  @Get('count')
  count() {
    return this.envRequestsService.count();
  }

  @Get()
  @ApiQuery({
    name: 'status',
    enum: EnvReservationStatus,
    description: 'Env reservations status to find',
    required: false,
  })
  findAll(@Query('status') status?: string) {
    return this.envRequestsService.findAll(status);
  }

  @Get('user')
  @ApiQuery({
    name: 'status',
    enum: EnvReservationStatus,
    description: 'Env reservations status to find',
    required: false,
  })
  findAllByUser(@Req() req: any, @Query('status') status?: string) {
    return this.envRequestsService.findAllByUser(req.user.user.id, status);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.envRequestsService.findOne(uuid);
  }

  @Patch(':uuid')
  update(
    @Req() req: any,
    @Body() @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateEnvironmentDto: UpdateEnvReservationDto,
  ) {
    return this.envRequestsService.update(uuid, updateEnvironmentDto, req.user.user);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.envRequestsService.remove(uuid);
  }
}
