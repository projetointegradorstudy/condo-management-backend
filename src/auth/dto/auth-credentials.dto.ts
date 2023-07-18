import { ApiProperty } from '@nestjs/swagger';
import { IsValid } from 'src/decorators/validate.decorator';

export class AuthCredentialsDto {
  @ApiProperty({ example: 'john.doo@contoso.com' })
  @IsValid()
  email: string;

  @ApiProperty({
    description: 'Password must have 10 character of length and at least one of each (A-Z, a-z, 0-9, !-@-$-*)',
    example: 'Abc3xamp!e',
  })
  @IsValid()
  password: string;
}
