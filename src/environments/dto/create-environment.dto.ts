import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsMimeType, IsOptional, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateEnvironmentDto {
  @ApiProperty({ example: 'Gym', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Allows .png, .jpg and jpeg - max size = 5MB',
  })
  @IsMimeType({ message: 'Must be .png, .jpg or .jpeg and should be up to 5MB' })
  @IsOptional()
  image?: any;

  @ApiProperty({
    example: 'It is a well equipped place with the bests machine to exercise',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  description: string;

  @ApiProperty({ example: 50, default: 0 })
  @IsNumber()
  @IsNotEmpty()
  @Transform((data) => +data.value)
  capacity: number;
}
