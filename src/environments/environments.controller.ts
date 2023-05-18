import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Inject } from '@nestjs/common';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { IEnvironmentService } from './interfaces/environments.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Environments')
@Controller('environments')
export class EnvironmentsController {
  constructor(@Inject(IEnvironmentService) private readonly environmentsService: IEnvironmentService) {}

  @Post()
  create(@Body() createEnvironmentDto: CreateEnvironmentDto) {
    return this.environmentsService.create(createEnvironmentDto);
  }

  @Get()
  findAll() {
    return this.environmentsService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.environmentsService.findOne(uuid);
  }

  @Patch(':uuid')
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() updateEnvironmentDto: UpdateEnvironmentDto) {
    return this.environmentsService.update(uuid, updateEnvironmentDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.environmentsService.remove(uuid);
  }
}
