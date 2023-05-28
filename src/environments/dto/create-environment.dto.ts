import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { Status } from '../entities/status.enum';
import { Transform } from 'class-transformer';

export class CreateEnvironmentDto {
  @ApiProperty({ example: 'Room' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Room', nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: 'enum', enum: Status, example: Status.AVAILABLE, required: true })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @ApiProperty({ example: 'https://aws.tes', nullable: true })
  @IsOptional()
  image?: string;

  @ApiProperty({ example: 50, default: 0, nullable: true })
  @IsNumber()
  @IsOptional()
  @Transform((data) => +data.value)
  capacity?: number;
}
