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
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserPasswordDto } from './dto/create-user-password.dto';
import { IUserService } from './interfaces/users-service.interface';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { FormData } from 'src/decorators/form-data.decorator';
import { fileMimetypeFilter } from 'src/utils/file-mimetype-filter';
import { ParseFile } from 'src/utils/parse-file.pipe';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(@Inject(IUserService) private readonly usersService: IUserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Post()
  create(@Body() adminCreateUserDto: AdminCreateUserDto) {
    return this.usersService.create(adminCreateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Get('count')
  count() {
    return this.usersService.count();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Get('admin/:uuid')
  findOneByAdmin(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.findOne(uuid);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('myself')
  findOne(@Req() req: any) {
    return this.usersService.findOne(req.user.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':uuid?/env-reservations')
  findUserRequests(@Req() req: any, @Param('uuid') uuid: string) {
    return this.usersService.findEnvReservationsById(uuid || req.user.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Patch('admin/:uuid/update')
  updateByAdmin(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() adminUpdateUserDto: AdminUpdateUserDto) {
    return this.usersService.updateByAdmin(uuid, adminUpdateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Patch('myself/update')
  @FormData(['avatar', 'name', 'password', 'passwordConfirmation'], false, {
    fileFilter: fileMimetypeFilter('png', 'jpg', 'jpeg'),
    limits: { fileSize: 5242880 /** <- 5mb */ },
  })
  @ApiBody({ required: false, type: UpdateUserDto })
  update(@Req() req: any, @Body() updateUserDto: UpdateUserDto, @UploadedFile(ParseFile) image?: Express.Multer.File) {
    return this.usersService.update(req.user.user.id, updateUserDto, image);
  }

  @Patch(':token/create-password')
  createPassword(@Param('token') token: string, @Body() createUserPasswordDto: CreateUserPasswordDto) {
    return this.usersService.createPassword(token, createUserPasswordDto);
  }

  @Patch('send-reset-email')
  sendResetPassEmail(@Query('email') email: string) {
    return this.usersService.sendResetPassEmail(email);
  }

  @Patch('reset-password')
  resetPassword(@Query('token') token: string, @Body() resetPasswordDto: ResetPasswordDto) {
    return this.usersService.resetPassword(token, resetPasswordDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.remove(uuid);
  }
}
