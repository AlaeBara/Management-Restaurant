import { BaseEntity } from 'src/common/entities/base.entity';
import { BeforeInsert, BeforeUpdate, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Column, Entity } from 'typeorm';
import { Purchase } from './purchase.entity';
import { Product } from 'src/product-management/entities/product.entity';
import { Inventory } from 'src/inventory-managemet/entities/inventory.entity';
import { PurchaseItemStatus } from '../enums/purchase-product-inventory-action-status.enum';


@Entity(process.env.DATASET_PREFIX + 'purchase_items')
@Index(['id', 'product', 'purchase', 'inventory'])
export class PurchaseItem extends BaseEntity {
    @ManyToOne(() => Product, { eager: true })
    @JoinColumn()
    product: Product;

    @ManyToOne(() => Purchase, { eager: true })
    @JoinColumn()
    purchase: Purchase;

    @ManyToOne(() => Inventory, { eager: true })
    @JoinColumn()
    inventory: Inventory;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    quantity: number;

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
    performeStatus() {
        if (this.quantityMoved + this.quantityReturned == this.quantity) {
            this.status = PurchaseItemStatus.COMPLETED;
        }

        if (this.quantity > (this.quantityMoved + this.quantityReturned) && (this.quantityMoved + this.quantityReturned) > 0) {
            this.status = PurchaseItemStatus.PARTIAL;
        }

    }
}