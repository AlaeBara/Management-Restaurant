import { BaseEntity } from 'src/common/entities/base.entity';
import { Supplier } from 'src/supplier-management/entities/supplier.entity';
import { User } from 'src/user-management/entities/user.entity';
import { CreateDateColumn, Index, JoinColumn, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Column, Entity } from 'typeorm';
import { PurchaseItem } from './purchase-item.entity';
import { PurchaseStatusHistory } from './purchase-status-history';

@Entity(process.env.DATASET_PREFIX + 'purchases')
@Index(['id', 'supplier', 'ownerReferenece', 'supplierReference'])
export class Purchase extends BaseEntity {
    @ManyToOne(() => Supplier, { eager: true })
    @JoinColumn()
    supplier: Supplier;

    @Column()
    movementAction: string;

    @CreateDateColumn({ type: 'timestamp', default: new Date() })
    purchaseDate: Date;

    @Column({ nullable: true })
    ownerReferenece: string

    @Column()
    supplierReference: string

    @Column({ type: "decimal", precision: 10, scale: 2 })
    totalAmountHT: number

    @Column({ type: "decimal", precision: 10, scale: 2 })
    totalAmountTTC: number

    @OneToMany(() => PurchaseStatusHistory, (purchaseStatusHistory) => purchaseStatusHistory.purchase)
    purchaseStatusHistory: PurchaseStatusHistory[];

    @OneToMany(() => PurchaseItem, (purchaseItem) => purchaseItem.purchase)
    purchaseItem: PurchaseItem[];

    @ManyToOne(() => User)
    @JoinColumn()
    createdBy: User;

    /* @RelationId((createdBy: User) => createdBy.id)
    createdById: string; */
}