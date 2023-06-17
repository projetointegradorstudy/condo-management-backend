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
} from '@nestjs/common';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IEnvironmentService } from './interfaces/environments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiTags('Environments')
@Controller('environments')
export class EnvironmentsController {
  constructor(@Inject(IEnvironmentService) private readonly environmentsService: IEnvironmentService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createEnvironmentDto: CreateEnvironmentDto) {
    return this.environmentsService.create(createEnvironmentDto);
  }

  @Get()
  findAll(@Query('status') status?: string) {
    return this.environmentsService.findAll(status);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.environmentsService.findOne(uuid);
  }

  @Roles(Role.ADMIN)
  @Patch(':uuid')
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() updateEnvironmentDto: UpdateEnvironmentDto) {
    return this.environmentsService.update(uuid, updateEnvironmentDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.environmentsService.remove(uuid);
  }
}
