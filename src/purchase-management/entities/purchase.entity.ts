import { BaseEntity } from 'src/common/entities/base.entity';
import { Supplier } from 'src/supplier-management/entities/supplier.entity';
import { User } from 'src/user-management/entities/user.entity';
import { BeforeInsert, BeforeUpdate, CreateDateColumn, Index, JoinColumn, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Column, Entity } from 'typeorm';
import { PurchaseItem } from './purchase-item.entity';
import { PurchaseStatus } from '../enums/purchase-status.enum';
import { Fund } from 'src/fund-management/entities/fund.entity';
import { PurchasePaiement } from './purchase-paiement.entity';
import { PurchasePaiementStatus } from '../enums/purchase-paiement-status.enum';

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

    @Column({ enum: PurchasePaiementStatus, default: PurchasePaiementStatus.UNPAID })
    paiementStatus: PurchasePaiementStatus;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    totalAmountHT: number

    @Column({ type: "decimal", precision: 10, scale: 2 })
    taxPercentage: number

    @Column({ type: "decimal", precision: 10, scale: 2 })
    totalAmountTTC: number

    @Column({ enum: ["percentage", "amount"], nullable: true })
    discountType: "percentage" | "amount" | null;

    // discountValue is the discount amount or the discount percentage
    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    discountValue: number | null;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    totalPaidAmount: number

    @Column({ type: "decimal", precision: 10, scale: 2 })
    totalRemainingAmount: number

    @OneToMany(() => PurchaseItem, purchaseItem => purchaseItem.purchase, {
        cascade: true,
        eager: true
    })
    purchaseItems: PurchaseItem[];

    @OneToMany(() => PurchasePaiement, purchasePaiement => purchasePaiement.purchase, {
        cascade: true,
        eager: true
    })
    purchasePaiements: PurchasePaiement[];

    @Column({ nullable: true })
    note: string;

    @ManyToOne(() => User)
    @JoinColumn()
    createdBy: User;

    @RelationId((Purchase: Purchase) => Purchase.createdBy)
    createdById: string;
}