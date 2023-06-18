import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsValid } from 'src/decorators/validate.decorator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsValid()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  passwordConfirmation: string;
}
