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
  RelationId,
} from 'typeorm';
import { Permission } from './permission.entity';
import { Exclude } from 'class-transformer';

@Entity(process.env.DATASET_PREFIX + 'roles')
@Index(['name', 'id'])
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  label: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToMany(() => Permission)
  @JoinTable({ name: process.env.DATASET_PREFIX + 'role_permissions' })
  permissions: Permission[];

  @RelationId((role: Role) => role.permissions)
  permissionIds: number[];
}
