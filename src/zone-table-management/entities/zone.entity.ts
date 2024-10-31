import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId, UpdateDateColumn } from "typeorm";


@Entity('zone')
@Index(['id','zoneCode','parentZone'])
export class Zone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  zoneLabel: string;

  @Column({ type: 'varchar', length: 50})
  zoneCode: string;

  @ManyToOne(() => Zone, (zone) => zone.id)
  @JoinColumn({ name: 'parent_zone_id' })
  parentZone: Zone;

  @RelationId((zone: Zone) => zone.parentZone)
  parentZoneId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({select: false})
  updatedAt: Date;

  @DeleteDateColumn({select: false})
  deletedAt: Date;
}
