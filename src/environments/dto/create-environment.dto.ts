import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { Status } from '../entities/status.enum';

export class CreateEnvironmentDto {
  @ApiProperty({ example: 'Room' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: 'enum', enum: Status, example: Status.AVAILABLE, required: true })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
  @ApiProperty({ example: 'https://aws.tes' })
  @IsOptional()
  image?: string;
}
