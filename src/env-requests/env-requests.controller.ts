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
import { UpdateEnvRequestDto } from './dto/update-env-request.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { CreateEnvRequestDto } from './dto/create-env-request.dto';
import { IEnvRequestService } from './interfaces/env-requests-service.interface';
import { Status } from 'src/environments/entities/status.enum';
import { EnvRequestStatus } from './entities/status.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiTags('Env_Requests')
@Controller('env-requests')
export class EnvRequestsController {
  constructor(@Inject(IEnvRequestService) private readonly envRequestsService: IEnvRequestService) {}

  @Post()
  create(@Body() createEnvRequestDto: CreateEnvRequestDto, @Req() req: any) {
    return this.envRequestsService.create(createEnvRequestDto, req.user.user.id);
  }

  @Get('count')
  count() {
    return this.envRequestsService.count();
  }

  @Get()
  findAll(@Query('status') status?: string) {
    return this.envRequestsService.findAll(status);
  }

  @Get('user')
  @ApiQuery({
    name: 'status',
    enum: EnvRequestStatus,
    description: 'Env requests status to find',
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
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() updateEnvironmentDto: UpdateEnvRequestDto) {
    return this.envRequestsService.update(uuid, updateEnvironmentDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.envRequestsService.remove(uuid);
  }
}
