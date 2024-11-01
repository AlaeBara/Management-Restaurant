import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  Entity,
  Index,
} from 'typeorm';
import { SupplierStatus } from '../enums/status-supplier.enum';

@Entity('supplier')
@Index(['name'])
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  fax: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  website: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: SupplierStatus ,default: SupplierStatus.ACTIVE})
  status: SupplierStatus;

  @Column()
  rcNumber: string;

  @Column()
  iceNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
