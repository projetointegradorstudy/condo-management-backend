import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { EnvReservationStatus } from '../entities/status.enum';

export class UpdateEnvReservationDto {
  @ApiProperty({ type: 'enum', enum: EnvReservationStatus, example: EnvReservationStatus.APPROVED, required: false })
  @IsEnum(EnvReservationStatus)
  @IsOptional()
  status?: EnvReservationStatus;
}
