import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, MaxLength } from 'class-validator';
import { IsValid } from 'src/decorators/validate.decorator';

export class MfaCredentialsDto {
  @ApiProperty({ example: 'john.doo@contoso.com' })
  @IsValid()
  email: string;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  @MaxLength(6)
  token: string;
}
