import { IsBoolean, IsNotEmpty } from 'class-validator';
import { IMfaOption } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class MfaOptionDto implements IMfaOption {
  @ApiProperty({ type: 'boolean' })
  @IsBoolean()
  @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : value))
  @IsNotEmpty()
  email: boolean;

  @ApiProperty({ type: 'boolean' })
  @IsBoolean()
  @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : value))
  @IsNotEmpty()
  appAuthenticator: boolean;
}
