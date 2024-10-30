import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Zone } from './zone.entity';
import { TableStatus } from '../enums/table-status.enum';

@Entity('table')
@Index(['id', 'tableCode','zone'])
export class Table {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  tableCode: string;

  @Column({ type: 'varchar', length: 50 })
  tableName: string;

  @ManyToOne(() => Zone, (zone) => zone.id)
  @JoinColumn({ name: 'zone_id' })
  zone: Zone;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: TableStatus, default: TableStatus.AVAILABLE })
  tableStatus: TableStatus;

  @Column({ type: 'varchar', nullable: true })
  qrcode: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;
}
