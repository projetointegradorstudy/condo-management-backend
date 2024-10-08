import { ApiProperty } from '@nestjs/swagger';
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { EnvironmentStatus } from './status.enum';
import { EnvReservation } from 'src/env-reservations/entities/env-reservation.entity';

@Entity({ name: 'environment' })
export class Environment {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Room' })
  @Column()
  name: string;

  @ApiProperty({ example: 'Room', nullable: true })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({ type: 'enum', enum: EnvironmentStatus, default: EnvironmentStatus.DISABLED })
  @Column({ type: 'enum', enum: EnvironmentStatus, default: EnvironmentStatus.DISABLED })
  status: EnvironmentStatus;

  @ApiProperty({ nullable: true, example: 'https://aws.test' })
  @Column({ nullable: true })
  image?: string;

  @ApiProperty({ example: 'Room', default: 0 })
  @Column({ default: 0 })
  capacity: number;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @ApiProperty({ required: false })
  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at?: Date;

  @OneToMany(() => EnvReservation, (envReservation: EnvReservation) => envReservation.environment)
  env_reservations: EnvReservation[];
}
