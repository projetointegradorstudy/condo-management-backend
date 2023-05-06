import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  BaseEntity,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  avatar?: string;

  @ApiProperty({ example: 'John Doo' })
  @Column()
  name: string;

  @ApiProperty({ uniqueItems: true, example: 'john_doo' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ example: 'Abc123@4' })
  @Column({ select: false })
  password: string;

  @ApiProperty({ type: 'enum', enum: Role, default: 'user' })
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @ApiProperty()
  @CreateDateColumn()
  registered_at: Date;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashField(): Promise<void> {
    const encrypt = async (field: string): Promise<void> => {
      try {
        this[`${field}`] = await bcrypt.hash(this[`${field}`], 10);
      } catch (e) {
        throw new InternalServerErrorException('There is some wrong in the hash');
      }
    };
    if (this.password) await encrypt('password');
  }
}
