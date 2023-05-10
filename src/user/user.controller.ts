import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('find-all')
  findAll() {
    return this.userService.findAll();
  }

  @Get('find-one/:uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.userService.findOne(uuid);
  }

  @Patch(':uuid/update')
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(uuid, updateUserDto);
  }

  @Patch('admin/:uuid/update')
  updateByAdmin(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() adminUpdateUserDto: AdminUpdateUserDto) {
    return this.userService.updateByAdmin(uuid, adminUpdateUserDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.userService.remove(uuid);
  }
}
