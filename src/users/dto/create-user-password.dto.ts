import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { IsValid } from 'src/decorators/validate.decorator';

export class CreateUserPasswordDto {
  @ApiProperty({
    description: 'New password must have 10 character of length and at least one of each (A-Z, a-z, 0-9, !-@-$-*)',
    example: 'Abc3xamp!e',
  })
  @IsValid()
  password: string;

  @ApiProperty({ description: 'Must be equal to the password', example: 'Abc3xamp!e', required: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  passwordConfirmation: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  partial_token?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
