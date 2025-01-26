import { UlidBaseEntity } from "src/common/entities/ulid-base.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Order } from "./order.entity";
import { PaymentStatus } from "../enums/payment-status.enum";
import { OrderPaymentType } from "../enums/order-payment-type.enum";
import { PaymentMethod } from "src/payment-management/entities/payment-method.entity";

@Entity(`${process.env.DATASET_PREFIX || ''}order_payments`)
@Index(['id'])
export class OrderPayment extends UlidBaseEntity {

    @ManyToOne(() => Order, (order) => order.id)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.id)
    @JoinColumn({ name: 'payment_method_id' })
    paymentMethod: PaymentMethod;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    givenAmount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    changeAmount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    paidAmount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    refundedAmount: number;

    @Column({ type: 'int', enum: PaymentStatus, nullable: true })
    status: PaymentStatus;

    @Column({ type: 'int', enum: OrderPaymentType, default: OrderPaymentType.PAYMENT })
    type: OrderPaymentType;

    @Column({ type: 'varchar', length: 255, nullable: true })
    reference: string;

}
