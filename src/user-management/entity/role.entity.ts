import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';
import { Permission } from './permission.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({select: false})
  @Exclude()
  updatedAt: Date;

  @DeleteDateColumn({select: false})
  @Exclude()
  deletedAt: Date;

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Permission[];
}
