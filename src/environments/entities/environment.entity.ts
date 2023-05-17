import { ApiProperty } from "@nestjs/swagger";
import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity } from "typeorm";
import { Status } from "./status.enum";

@Entity({name: 'environments'})
export class Environment {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ApiProperty({ example: 'Room' })
    @Column()
    name: string;
  
    @ApiProperty({ type: 'enum', enum: Status, default: 'available' })
    @Column({ type: 'enum', enum: Status, default: Status.AVAILABLE })
    status: Status;
  
    @ApiProperty({ example: 'https://aws.test' })
    @Column()
    image?: string;
  
    @ApiProperty()
    @CreateDateColumn()
    created_at: Date;
  
    @ApiProperty()
    @UpdateDateColumn()
    updated_at: Date;
}
