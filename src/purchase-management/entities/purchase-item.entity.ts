import { BaseEntity } from 'src/common/entities/base.entity';
import { AfterUpdate, BeforeInsert, BeforeUpdate, Index, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { Column, Entity } from 'typeorm';
import { Purchase } from './purchase.entity';
import { Product } from 'src/product-management/entities/product.entity';
import { Inventory } from 'src/inventory-managemet/entities/inventory.entity';
import { PurchaseItemStatus } from '../enums/purchase-product-inventory-action-status.enum';
import { PurchaseStatus } from '../enums/purchase-status.enum';


@Entity(process.env.DATASET_PREFIX + 'purchase_items')
@Index(['id', 'product', 'purchase', 'inventory'])
export class PurchaseItem extends BaseEntity {
    @ManyToOne(() => Product, { eager: true })
    @JoinColumn()
    product: Product;

    @ManyToOne(() => Purchase, purchase => purchase.purchaseItems, { onDelete: 'CASCADE' })
    purchase: Purchase;

    @RelationId((purchaseItem: PurchaseItem) => purchaseItem.purchase)
    purchaseId: string;

    @ManyToOne(() => Inventory, { eager: true })
    @JoinColumn()
    inventory: Inventory;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    quantity: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    unitPrice: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    totalAmount: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    quantityInProgress: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    quantityMoved: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    quantityReturned: number;

    @Column({ enum: PurchaseItemStatus, default: PurchaseItemStatus.PENDING })
    status: PurchaseItemStatus

    @BeforeInsert()
    setquantityInProgress() {
        this.quantityInProgress = this.quantity;
    }

    @BeforeUpdate()
    updateStatus() {
        const processedQuantity = Number(this.quantityMoved) + Number(this.quantityReturned);
        if (processedQuantity === Number(this.quantity)) {
            this.status = PurchaseItemStatus.COMPLETED;
        } else if (processedQuantity > 0 && processedQuantity < Number(this.quantity)) {
            this.status = PurchaseItemStatus.PARTIAL;
        } else {
            this.status = PurchaseItemStatus.PENDING;
        }
    }
}