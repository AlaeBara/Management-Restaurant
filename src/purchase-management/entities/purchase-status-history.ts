import { BaseEntity } from 'src/common/entities/base.entity';
import { Index, JoinColumn, ManyToOne } from 'typeorm';
import { Column, Entity } from 'typeorm';
import { Purchase } from './purchase.entity';
import { User } from 'src/user-management/entities/user.entity';
import { PurchaseStatus } from '../enums/purchase-status.enum';



@Entity(process.env.DATASET_PREFIX + 'purchase_status_histories')
@Index(['id', 'status',])
export class PurchaseStatusHistory extends BaseEntity {
    @ManyToOne(() => Purchase, { eager: true })
    @JoinColumn()
    purchase: Purchase;

    @Column({ enum: PurchaseStatus, default: PurchaseStatus.CREATED })
    status: PurchaseStatus;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn()
    createdBy: User;
}