import { UlidBaseEntity } from "src/common/entities/ulid-base.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Order } from "./order.entity";
import { MenuItem } from "src/menu-item-management/entities/menu-item.entity";
import { User } from "src/user-management/entities/user.entity";

@Entity(`${process.env.DATASET_PREFIX || ''}order_items`)
@Index(['id'])
export class OrderItem extends UlidBaseEntity {

    @ManyToOne(() => Order, (order) => order.id)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @ManyToOne(() => MenuItem, (product) => product.id)
    @JoinColumn({ name: 'product_id' })
    product: MenuItem;

    @Column({ type: 'int', nullable: true })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    total: number;

    @Column({ type: 'boolean', default: false })
    isRefunded: boolean;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'refunded_by_id' })
    refundedBy: User;

    @Column({ type: 'timestamp', nullable: true })
    refundedAt: Date | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    refundReason: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    refundNote: string | null;

}
