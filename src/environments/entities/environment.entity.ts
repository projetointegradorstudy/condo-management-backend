import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity } from 'typeorm';
import { Status } from './status.enum';

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

  @ApiProperty({ type: 'enum', enum: Status, default: 'available' })
  @Column({ type: 'enum', enum: Status, default: Status.AVAILABLE })
  status: Status;

  @ApiProperty({ example: 'https://aws.test' })
  @Column()
  image?: string;

  @ApiProperty({ example: 'Room', default: 0 })
  @Column({ default: 0 })
  capacity: number;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}
