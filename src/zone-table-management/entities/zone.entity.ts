import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('zone')
@Index(['id','zoneCode','parentZone'])
export class Zone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  zoneLabel: string;

  @Column({ type: 'varchar', length: 50 ,unique: true})
  zoneCode: string;

  @ManyToOne(() => Zone, (zone) => zone.id)
  @JoinColumn({ name: 'parent_zone_id' })
  parentZone: Zone;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({select: false})
  updatedAt: Date;

  @DeleteDateColumn({select: false})
  deletedAt: Date;
}
