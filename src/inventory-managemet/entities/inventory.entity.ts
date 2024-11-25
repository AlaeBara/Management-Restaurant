import { BaseEntity } from 'src/common/entities/base.entity';
import { Product } from 'src/product-management/entities/product.entity';
import { Storage } from 'src/storage-management/entities/storage.entity';
import { AfterLoad, Index, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { Column, Entity } from 'typeorm';

@Entity(process.env.DATASET_PREFIX + 'inventories')
@Index(['sku', 'id', 'storage', 'product'])
export class Inventory extends BaseEntity {
    @Column()
    sku: string;

    @Column({ default: 15 })
    warningQuantity: number;

    @Column({ default: 0 })
    totalQuantity: number;

    @ManyToOne(() => Storage, { eager: true })
    @JoinColumn({ name: 'storageId' })
    storage: Storage;

    @RelationId((inventory: Inventory) => inventory.storage)
    storageId: string | null;

    @ManyToOne(() => Product, { eager: true })
    @JoinColumn({ name: 'productId' })
    product: Product;

    @RelationId((inventory: Inventory) => inventory.product)
    productId: string | null;

    productUnit: string;
    productName: string;
    storageName: string;

    @AfterLoad()
    setProductDetails(): void {
        this.productUnit = this.product?.unit ?? null;
        this.productName = this.product?.productName ?? null;
        this.storageName = this.storage?.storageName ?? null;
        delete this.product;
        delete this.storage;
    }
}