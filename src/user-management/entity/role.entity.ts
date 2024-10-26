import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  Index,
} from 'typeorm';
import { Permission } from './permission.entity';
import { Exclude } from 'class-transformer';

@Entity()
@Index(['name','id'])
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  label: string;

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
