import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateEnvironmentDto } from './create-environment.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { Status } from '../entities/status.enum';

export class UpdateEnvironmentDto extends PartialType(CreateEnvironmentDto) {
  @ApiProperty({ type: 'enum', enum: Status, example: Status.AVAILABLE })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
