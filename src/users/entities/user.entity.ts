import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  BaseEntity,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { Role } from 'src/auth/roles/role.enum';
import { EnvRequest } from 'src/env-requests/entities/env-request.entity';

@Entity()
export class User extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  avatar?: string;

  @ApiProperty({ example: 'John Doo', nullable: true })
  @Column({ nullable: true })
  name?: string;

  @ApiProperty({ uniqueItems: true, example: 'john_doo@contoso.com' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'Abc123@4', nullable: true })
  @Column({ select: false, nullable: true })
  password?: string;

  @ApiProperty({ type: 'enum', enum: Role, default: 'user' })
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @ApiProperty({ example: true, default: false })
  @Column({ default: false })
  is_active: boolean;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  partial_token?: string;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ required: false })
  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date;

  @OneToMany(() => EnvRequest, (envRequest: EnvRequest) => envRequest.user)
  env_requests: EnvRequest[];

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

  constructor(user?: Partial<User>) {
    super();
    this.id = user && user.id;
    this.name = user && user.name;
    this.email = user && user.email;
    this.is_active = user && user.is_active;
    this.role = user && user.role;
    this.created_at = user && user.created_at;
    this.updated_at = user && user.updated_at;
  }
}
