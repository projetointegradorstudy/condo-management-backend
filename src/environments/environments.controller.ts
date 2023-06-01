import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Inject, Query } from '@nestjs/common';
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
  findAll(@Query('status') status?: string) {
    return this.environmentsService.findAll(status);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.environmentsService.findOne(uuid);
  }

  @Patch(':uuid')
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() updateEnvironmentDto: UpdateEnvironmentDto) {
    return this.environmentsService.update(uuid, updateEnvironmentDto);
  }

  @Patch(':uuid/request')
  request(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() updateEnvironmentDto: UpdateEnvironmentDto) {
    return this.environmentsService.request(uuid, updateEnvironmentDto);
  }

  @Patch(':uuid/approve')
  approve(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() updateEnvironmentDto: UpdateEnvironmentDto) {
    return this.environmentsService.approve(uuid, updateEnvironmentDto);
  }

  @Patch(':uuid/release')
  release(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() updateEnvironmentDto: UpdateEnvironmentDto) {
    return this.environmentsService.release(uuid, updateEnvironmentDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.environmentsService.remove(uuid);
  }
}
