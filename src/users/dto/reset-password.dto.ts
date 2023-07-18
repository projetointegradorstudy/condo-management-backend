import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsValid } from 'src/decorators/validate.decorator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'New password must have 10 character of length and at least one of each (A-Z, a-z, 0-9, !-@-$-*)',
    example: 'Abc3xamp!e',
  })
  @IsValid()
  password: string;

  @ApiProperty({ description: 'Must be equal to the password', example: 'Abc3xamp!e' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  passwordConfirmation: string;
}
