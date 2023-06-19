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
} from '@nestjs/common';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IEnvironmentService } from './interfaces/environments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { FormDataEnvironment } from 'src/decorators/formdata-environment.decorator';
import { fileMimetypeFilter } from 'src/utils/file-mimetype-filter';
import { ParseFile } from 'src/utils/parse-file.pipe';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiTags('Environments')
@Controller('environments')
export class EnvironmentsController {
  constructor(@Inject(IEnvironmentService) private readonly environmentsService: IEnvironmentService) {}

  @Roles(Role.ADMIN)
  @Post()
  @FormDataEnvironment(['name', 'description', 'capacity'], true, {
    fileFilter: fileMimetypeFilter('png', 'jpg', 'jpeg'),
    limits: { fileSize: 5242880 /** <- 5mb */ },
  })
  create(@Body() createEnvironmentDto: CreateEnvironmentDto, @UploadedFile(ParseFile) image?: Express.Multer.File) {
    return this.environmentsService.create(createEnvironmentDto, image);
  }

  @Roles(Role.ADMIN)
  @Get('count')
  count() {
    return this.environmentsService.count();
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
  @FormDataEnvironment(['image', 'name', 'description', 'status', 'capacity'], false, {
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

  @Roles(Role.ADMIN)
  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.environmentsService.remove(uuid);
  }
}
