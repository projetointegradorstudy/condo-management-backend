import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/auth/roles/role.enum';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { IsValid } from 'src/decorators/validate.decorator';

export class AdminUpdateUserDto {
  @ApiProperty({
    required: false,
    description: 'New password, must have 10 character of length and at least one of each (A-Z, a-z, 0-9, !-@-$-*)',
    example: 'Abc3xamp!e',
  })
  @IsValid()
  @IsOptional()
  password?: string;

  @ApiProperty({ description: 'Must be equal to the password', example: 'Abc3xamp!e', required: false })
  @IsString()
  @IsOptional()
  @MinLength(10)
  passwordConfirmation?: string;

  @ApiProperty({ type: 'enum', enum: Role, example: Role.USER, required: false })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
