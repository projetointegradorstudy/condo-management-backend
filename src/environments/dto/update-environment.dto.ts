import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateEnvironmentDto } from './create-environment.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { EnvironmentStatus } from '../entities/status.enum';

export class UpdateEnvironmentDto extends PartialType(CreateEnvironmentDto) {
  @ApiProperty({ type: 'enum', enum: EnvironmentStatus, example: EnvironmentStatus.AVAILABLE, required: false })
  @IsEnum(EnvironmentStatus)
  @IsOptional()
  status?: EnvironmentStatus;
}
