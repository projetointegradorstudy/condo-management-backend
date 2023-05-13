import { PartialType,ApiProperty } from '@nestjs/swagger';
import { CreateEnvironmentDto } from './create-environment.dto';
import { Status } from '../entities/status.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateEnvironmentDto extends PartialType(CreateEnvironmentDto) {
    @ApiProperty({ example: 'Room' })
    @IsString()
    name?: string;

    @ApiProperty({ type: 'enum', enum: Status, example: Status.AVAILABLE, required: true })
    @IsEnum(Status)
    @IsNotEmpty()
    status: Status;

    @ApiProperty({example: 'https://aws.tes' })
    @IsString()
    image?: string;
}
