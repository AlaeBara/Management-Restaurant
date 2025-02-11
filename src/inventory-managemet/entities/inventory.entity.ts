import { BaseEntity } from 'src/common/entities/base.entity';
import { Product } from 'src/product-management/entities/product.entity';
import { Storage } from 'src/storage-management/entities/storage.entity';
import { Unit } from 'src/unit-management/entities/unit.entity';
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
    currentQuantity: number;

    @ManyToOne(() => Storage, { eager: true })
    @JoinColumn()
    storage: Storage;

    @ManyToOne(() => Product, { eager: true })
    @JoinColumn()
    product: Product;

    @ManyToOne(() => Unit, { eager: true })
    @JoinColumn()
    unit: Unit;

    @RelationId((inventory: Inventory) => inventory.product)
    productId: string | null;
}