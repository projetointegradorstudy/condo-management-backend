import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { IsValid } from 'src/decorators/validate.decorator';

export class AdminCreateUserDto {
  @ApiProperty({ example: 'john.doo@contoso.com' })
  @IsValid()
  email: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  partial_token?: string;
}
