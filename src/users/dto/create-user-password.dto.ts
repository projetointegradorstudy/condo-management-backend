import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { IsValid } from 'src/decorators/validate.decorator';

export class CreateUserPasswordDto {
  @ApiProperty()
  @IsValid()
  password: string;

  @ApiProperty()
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
