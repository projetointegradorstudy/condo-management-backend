import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/auth/roles/role.enum';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { IsValid } from 'src/decorators/validate.decorator';

export class AdminUpdateUserDto {
  @ApiProperty()
  @IsValid()
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MinLength(10)
  passwordConfirmation?: string;

  @ApiProperty({ type: 'enum', enum: Role, example: Role.USER, required: false })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
