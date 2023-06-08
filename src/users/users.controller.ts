import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserPasswordDto } from './dto/create-user-password.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Post()
  create(@Body() adminCreateUserDto: AdminCreateUserDto) {
    return this.usersService.create(adminCreateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Get('')
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Patch('admin/:uuid/update')
  updateByAdmin(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() adminUpdateUserDto: AdminUpdateUserDto) {
    return this.usersService.updateByAdmin(uuid, adminUpdateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Patch(':uuid/update')
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(uuid, updateUserDto);
  }

  @Patch(':token/create-password')
  createPassword(@Param('token') token: string, @Body() createUserPasswordDto: CreateUserPasswordDto) {
    return this.usersService.createPassword(token, createUserPasswordDto);
  }

  @Patch('send-reset-email')
  sendResetPassEmail(@Body() requestResetPasswordDto: AdminCreateUserDto) {
    return this.usersService.sendResetPassEmail(requestResetPasswordDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.remove(uuid);
  }
}
