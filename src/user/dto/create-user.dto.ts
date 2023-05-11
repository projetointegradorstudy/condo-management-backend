import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Role } from 'src/auth/roles/role.enum';

export class CreateUserDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ example: 'John Doo' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'John Doo' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  passwordConfirmation: string;

  @ApiProperty({ type: 'enum', enum: Role, example: Role.USER, required: false })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
