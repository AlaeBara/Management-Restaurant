
import {
    BeforeInsert,
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany
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
import { OrderItem } from "./order-item.entity";
import { Guest } from "./guest.entity";
import { OrderStatusHistory } from "./order-status-history.entity";
import { OrderPayment } from "./order-payment.entity";

@Entity(`${process.env.DATASET_PREFIX || ''}orders`)
@Index(['id', 'orderNumber'])
export class Order extends UlidBaseEntity {

    @Column({ type: 'varchar', length: 50, unique: true })
    orderNumber: string;

    @ManyToOne(() => Table, (table) => table.id)
    @JoinColumn({ name: 'table_id' })
    table: Table;

    @ManyToOne(() => User, (user) => user.id, { nullable: true })
    @JoinColumn({ name: 'served_by' })
    servedBy: User;

    @ManyToOne(() => Client, (client) => client.id, { nullable: true })
    @JoinColumn({ name: 'client_id' })
    client: Client;

    @ManyToOne(() => Guest, (guest) => guest.id, { nullable: true })
    @JoinColumn({ name: 'guest_id' })
    guest: Guest;

    @Column({ type: 'int', nullable: true })
    numberOfSeats: number;

    @Column({ type: 'int', enum: ServiceType, default: ServiceType.SERVICE_A_LA_FOIS })
    serviceType: ServiceType;

    @Column({ type: 'varchar', length: 255, nullable: true })
    note: string | null;

    @Column({ type: 'int', enum: DeliveryType, default: DeliveryType.ON_SITE })
    deliveryType: DeliveryType;

    @Column({ type: 'int', enum: OrderStatus, default: OrderStatus.CREATED })
    orderStatus: OrderStatus;

    @Column({ type: 'int', enum: DiscountType, default: null, nullable: true })
    discountType: DiscountType | null;

    // discountValue is the discount amount or the discount percentage
    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    discountValue: number | null;

    @Column({ type: "varchar", length: 255, nullable: true })
    discountRaison: string | null;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    totalAmount: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    totalPaidAmount: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    totalAditionalPrice: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    totalRefundedAmount: number;

    @Column({ type: 'int', enum: PaymentStatus, default: PaymentStatus.PENDING })
    paymentStatus: PaymentStatus;

    @Column({ type: 'boolean', default: false })
    isTransfer: boolean;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true, eager: true })
    orderItems: OrderItem[];

    @OneToMany(() => OrderStatusHistory, (orderStatusHistory) => orderStatusHistory.order, { cascade: true })
    orderStatusHistory: OrderStatusHistory[];

    @OneToMany(() => OrderPayment, (orderPayment) => orderPayment.order, { cascade: true, eager: true, onDelete: 'CASCADE' })
    orderPayments: OrderPayment[];

    @BeforeInsert()
    generateOrderNumber(): void {
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase(); // Random 6-character string
        const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // Random 3-digit number
        this.orderNumber = `CMD-${randomString}-${randomNum}`;
    }
}
