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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { IEnvironmentService } from './interfaces/environments-service.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { FormData } from 'src/decorators/form-data.decorator';
import { fileMimetypeFilter } from 'src/utils/file-mimetype-filter';
import { ParseFile } from 'src/utils/parse-file.pipe';
import { EnvironmentStatus } from './entities/status.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiTags('Environments')
@Controller('environments')
export class EnvironmentsController {
  constructor(@Inject(IEnvironmentService) private readonly environmentsService: IEnvironmentService) {}

  @Roles(Role.ADMIN)
  @Post()
  @FormData(['image', 'name', 'description', 'capacity'], true, {
    fileFilter: fileMimetypeFilter('png', 'jpg', 'jpeg'),
    limits: { fileSize: 5242880 /** <- 5mb */ },
  })
  @ApiOperation({ summary: 'Create a new Environment' })
  @ApiBody({ type: CreateEnvironmentDto })
  create(@Body() createEnvironmentDto: CreateEnvironmentDto, @UploadedFile(ParseFile) image?: Express.Multer.File) {
    return this.environmentsService.create(createEnvironmentDto, image);
  }

  @Roles(Role.ADMIN)
  @Get('count')
  count() {
    return this.environmentsService.count();
  }

  @Get()
  @ApiQuery({
    name: 'status',
    enum: EnvironmentStatus,
    description: 'Environments status to find',
    required: false,
  })
  findAll(@Query('status') status?: string) {
    return this.environmentsService.findAll(status);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.environmentsService.findOne(uuid);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':uuid?/env-reservations')
  findEnvReservationsById(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.environmentsService.findEnvReservationsById(uuid);
  }

  @Roles(Role.ADMIN)
  @Patch(':uuid')
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

  @Roles(Role.ADMIN)
  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.environmentsService.remove(uuid);
  }
}
