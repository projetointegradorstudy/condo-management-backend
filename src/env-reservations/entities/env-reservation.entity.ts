import { ApiProperty } from '@nestjs/swagger';
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EnvReservationStatus } from './status.enum';
import { User } from 'src/users/entities/user.entity';
import { Environment } from 'src/environments/entities/environment.entity';

@Entity({ name: 'env_reservation' })
export class EnvReservation {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: 'enum', enum: EnvReservationStatus, default: EnvReservationStatus.APPROVED })
  @Column({ type: 'enum', enum: EnvReservationStatus, default: EnvReservationStatus.PENDING })
  status: EnvReservationStatus;

  @ApiProperty({ type: 'uuid', example: '571cecb0-0dce-4fa0-8410-aee5646fcfed' })
  @Column({ type: 'uuid' })
  user_id: string;

  @ApiProperty({ type: 'uuid', example: '571cecb0-0dce-4fa0-8410-aee5646fcfed' })
  @Column({ type: 'uuid' })
  environment_id: string;

  @ApiProperty({ example: '2023-06-08 21:50' })
  @Column()
  date_in: Date;

  @ApiProperty({ example: '2023-06-08 21:50' })
  @Column()
  date_out: Date;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @ApiProperty({ required: false })
  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at?: Date;

  @ManyToOne(() => User, (user: User) => user.env_reservations)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: User;

  @ManyToOne(() => Environment, (environment: Environment) => environment.env_reservations)
  @JoinColumn({ name: 'environment_id', referencedColumnName: 'id' })
  environment?: Environment;
}
