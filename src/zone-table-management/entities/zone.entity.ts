import { User } from "src/user-management/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId, UpdateDateColumn } from "typeorm";
import { ZoneStatus } from "../enums/zone-status.enum";


@Entity(process.env.DATASET_PREFIX + 'zones')
@Index(['id', 'zoneCode', 'parentZone'])
export class Zone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  zoneLabel: string;

  @Column({ type: 'varchar', length: 50 })
  zoneCode: string;

  @ManyToOne(() => Zone, (zone) => zone.id)
  @JoinColumn({ name: 'parent_zone_id' })
  parentZone: Zone;

  @RelationId((zone: Zone) => zone.parentZone)
  parentZoneId: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'currentWaiterId' })
  currentWaiter: User

  @Column({ type: 'enum', enum: ZoneStatus, default: ZoneStatus.AVAILABLE })
  status: ZoneStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;
}
