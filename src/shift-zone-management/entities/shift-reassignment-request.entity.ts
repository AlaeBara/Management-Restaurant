import { Entity, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Zone } from 'src/zone-table-management/entities/zone.entity';
import { User } from 'src/user-management/entities/user.entity';
import { RequestShiftStatus } from '../enums/request-shift.enum';

@Entity(process.env.DATASET_PREFIX + 'shift_reassignment_request')
export class ShiftReassignmentRequest extends BaseEntity {
    @ManyToOne(() => Zone, (zone) => zone.id)
    @JoinColumn({ name: 'zoneId' })
    zone: Zone; // The zone for which the reassignment is requested

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'currentWaiterId' })
    currentWaiter: User; // The waiter currently assigned to the zone

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'requestedWaiterId' })
    requestedWaiter: User; // The waiter requesting to take over the zone

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'approvedById' })
    approvedBy: User; // The manager or current waiter who approved the reassignment

    @Column({ type: 'enum', enum: RequestShiftStatus, default: RequestShiftStatus.PENDING })
    status: RequestShiftStatus; // The status of the reassignment request

    @CreateDateColumn({ type: 'timestamp' })
    requestedAt: Date; // When the reassignment request was made

    @Column({ type: 'timestamp', nullable: true })
    resolvedAt: Date; // When the reassignment request was resolved (optional)

    @Column({ type: 'text', nullable: true })
    rejectionReason: string; // Reason for rejection, if applicable (optional)
}
