import { Index, JoinColumn, ManyToOne } from 'typeorm';
import { CreateDateColumn, Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Zone } from 'src/zone-table-management/entities/zone.entity';
import { User } from 'src/user-management/entities/user.entity';
import { ShiftZoneActionType } from '../enums/shift-zone.enum';
import { ShiftReassignmentRequest } from './shift-reassignment-request.entity';

@Entity(process.env.DATASET_PREFIX + 'shift_zone')
@Index(['zone', 'pointingDate'])
export class ShiftZone extends BaseEntity {
    @ManyToOne(() => Zone, (zone) => zone.id)
    @JoinColumn({ name: 'zoneId' })
    zone: Zone;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'waiterId' })
    waiter: User;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'actionById' })
    auditingUser: User; // User who made the action

    @ManyToOne(() => ShiftReassignmentRequest, (request) => request.id, { nullable: true })
    @JoinColumn({ name: 'reassignmentRequestId' })
    reassignmentRequest: ShiftReassignmentRequest;

    @Column({ type: 'enum', enum: ShiftZoneActionType })
    actionType: ShiftZoneActionType;

    @CreateDateColumn({ type: 'timestamp' })
    pointingDate: Date;
}
