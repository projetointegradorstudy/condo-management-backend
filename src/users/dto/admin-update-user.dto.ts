import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/auth/roles/role.enum';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class AdminUpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  passwordConfirmation?: string;

  @ApiProperty({ type: 'enum', enum: Role, example: Role.USER, required: false })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
