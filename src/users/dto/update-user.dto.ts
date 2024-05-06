import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { IsValid } from 'src/decorators/validate.decorator';
import { Type } from 'class-transformer';
import { MfaOptionDto } from './mfa-option.dto';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Allows .png, .jpg and jpeg - max size = 5MB',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  avatar?: any;

  @ApiProperty({ example: 'John Doo', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    required: false,
    description: 'New password, must have 10 character of length and at least one of each (A-Z, a-z, 0-9, !-@-$-*)',
    example: 'Abc3xamp!e',
  })
  @IsValid()
  @IsOptional()
  password?: string;

  @ApiProperty({ description: 'Must be equal to the password', required: false, example: 'Abc3xamp!e' })
  @MinLength(10)
  @IsOptional()
  passwordConfirmation?: string;

  @ApiProperty({ type: MfaOptionDto, required: false, example: new MfaOptionDto() })
  @ValidateNested()
  @Type(() => MfaOptionDto)
  @IsObject()
  @IsOptional()
  mfaOption?: MfaOptionDto;
}
