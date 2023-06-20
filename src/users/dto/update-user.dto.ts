import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { IsValid } from 'src/decorators/validate.decorator';

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doo', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'https://aws.tes', nullable: true })
  @IsOptional()
  avatar?: string;

  @ApiProperty({ required: false })
  @IsValid()
  @IsOptional()
  password?: string;

  @ApiProperty({ required: false })
  @MinLength(10)
  @IsOptional()
  passwordConfirmation?: string;
}
