import { BaseEntity } from 'src/common/entities/base.entity';
import { Supplier } from 'src/supplier-management/entities/supplier.entity';
import { User } from 'src/user-management/entities/user.entity';
import { BeforeUpdate, CreateDateColumn, Index, JoinColumn, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Column, Entity } from 'typeorm';
import { PurchaseItem } from './purchase-item.entity';
import { PurchaseStatusHistory } from './purchase-status-history';
import { PurchaseStatus } from '../enums/purchase-status.enum';
import { Fund } from 'src/fund-management/entities/fund.entity';
import { PurchaseItemStatus } from '../enums/purchase-product-inventory-action-status.enum';

@Entity(process.env.DATASET_PREFIX + 'purchases')
@Index(['id', 'supplier', 'ownerReferenece', 'supplierReference'])
export class Purchase extends BaseEntity {
    @ManyToOne(() => Supplier, { eager: true })
    @JoinColumn()
    supplier: Supplier;

    @RelationId((Purchase: Purchase) => Purchase.supplier)
    supplierId: string;

    /* @Column()
    movementAction: string; */

    @Column({ enum: PurchaseStatus, default: PurchaseStatus.CREATED })
    status: PurchaseStatus;

    @CreateDateColumn({ type: 'timestamp', default: new Date() })
    purchaseDate: Date;

    @ManyToOne(() => Fund, { eager: true })
    @JoinColumn()
    sourcePayment: Fund;

    @RelationId((Purchase: Purchase) => Purchase.sourcePayment)
    sourcePaymentId: string;

    @Column({ nullable: true })
    ownerReferenece: string

    @Column()
    supplierReference: string

    @Column({ type: "decimal", precision: 10, scale: 2 })
    totalAmountHT: number

    @Column({ type: "decimal", precision: 10, scale: 2 })
    taxPercentage: number

    @Column({ type: "decimal", precision: 10, scale: 2 })
    totalAmountTTC: number

    @OneToMany(() => PurchaseStatusHistory, (purchaseStatusHistory) => purchaseStatusHistory.purchase)
    purchaseStatusHistory: PurchaseStatusHistory[];

    @OneToMany(() => PurchaseItem, purchaseItem => purchaseItem.purchase, {
        cascade: true,
        eager: true
    })
    purchaseItems: PurchaseItem[];

    @ManyToOne(() => User)
    @JoinColumn()
    createdBy: User;

    @RelationId((Purchase: Purchase) => Purchase.createdBy)
    createdById: string;
}