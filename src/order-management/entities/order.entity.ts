
import {
    BeforeInsert,
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne
} from "typeorm";

import { Client } from "src/client-management/entities/client.entity";
import { UlidBaseEntity } from "src/common/entities/ulid-base.entity";
import { User } from "src/user-management/entities/user.entity";
import { Table } from "src/zone-table-management/entities/table.entity";
import { ServiceType } from "../enums/service-type.enum";
import { DeliveryType } from "../enums/order-type.enum";
import { OrderStatus } from "../enums/order-status.enum";
import { PaymentStatus } from "../enums/payment-status.enum";
import { DiscountType } from "../enums/discount.enum";

@Entity(`${process.env.DATASET_PREFIX || ''}orders`)
@Index(['id', 'orderNumber'])
export class Order extends UlidBaseEntity {

    @Column({ type: 'varchar', length: 50 })
    orderNumber: string;

    @ManyToOne(() => Table, (table) => table.id)
    @JoinColumn({ name: 'table_id' })
    table: Table;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'server_by_id' })
    servedBy: User;

    @ManyToOne(() => Client, (client) => client.id, { nullable: true })
    @JoinColumn({ name: 'client_id' })
    client: Client;

    @Column({ type: 'int', nullable: true })
    numberOfSeats: number;

    @Column({ type: 'int', enum: ServiceType, default: ServiceType.SERVICE_A_LA_FOIS })
    serviceType: ServiceType;

    @Column({ type: 'int', enum: DeliveryType, default: DeliveryType.ON_SITE })
    deliveryType: DeliveryType;

    @Column({ type: 'int', enum: OrderStatus, default: OrderStatus.CREATED })
    orderStatus: OrderStatus;

    @Column({ enum: DiscountType, default: DiscountType.PERCENTAGE })
    discountType: DiscountType;

    // discountValue is the discount amount or the discount percentage
    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    discountValue: number | null;

    @Column({ type: "varchar", length: 255, nullable: true })
    discountRaison: string | null;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    totalAmount: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    totalPaidAmount: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    totalRefundedAmount: number;

    @Column({ type: 'int', enum: PaymentStatus, default: PaymentStatus.PENDING })
    paymentStatus: PaymentStatus;

    @Column({ type: 'boolean', default: false })
    isTransfer: boolean;

    @BeforeInsert()
    generateOrderNumber(): void {
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase(); // Random 6-character string
        this.orderNumber = `CMD-${randomString}`;
    }
}
