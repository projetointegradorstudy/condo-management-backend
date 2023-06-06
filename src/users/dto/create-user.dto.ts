import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'johndoo@contoso.com' })
  @IsString()
  @IsNotEmpty()
  email: string;
}
