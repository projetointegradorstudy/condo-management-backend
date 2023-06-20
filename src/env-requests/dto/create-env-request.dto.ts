import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsUUID, IsDate } from 'class-validator';

export class CreateEnvRequestDto {
  @ApiProperty({ type: 'uuid', example: '571cecb0-0dce-4fa0-8410-aee5646fcfed' })
  @IsUUID()
  @IsNotEmpty()
  environment_id: string;

  @ApiProperty({ example: '2023-06-08 21:50:38' })
  @IsDate()
  @IsNotEmpty()
  @Transform((data) => new Date(data.value))
  date_in: Date;

  @ApiProperty({ example: '2023-06-08 21:50:38' })
  @IsDate()
  @IsNotEmpty()
  @Transform((data) => new Date(data.value))
  date_out: Date;
}
