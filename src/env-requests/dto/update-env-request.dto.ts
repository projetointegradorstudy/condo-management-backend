import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { EnvRequestStatus } from '../entities/status.enum';

export class UpdateEnvRequestDto {
  @ApiProperty({ type: 'enum', enum: EnvRequestStatus, example: EnvRequestStatus.APPROVED })
  @IsEnum(EnvRequestStatus)
  @IsOptional()
  status?: EnvRequestStatus;
}
