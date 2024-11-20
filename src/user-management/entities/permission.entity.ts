import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Index(['name', 'id'])
@Entity(process.env.DATASET_PREFIX + 'permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  label: string;

  @Column()
  resource: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
