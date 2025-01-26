import { UlidBaseEntity } from "src/common/entities/ulid-base.entity";
import { Entity, Index, JoinColumn, Column, ManyToOne } from "typeorm";
import { Order } from "./order.entity";
import { OrderStatus, OrderStatusHistoryEnum } from "../enums/order-status.enum";
import { User } from "src/user-management/entities/user.entity";

@Entity(`${process.env.DATASET_PREFIX || ''}order_status_history`)
@Index(['id', 'status'])
export class OrderStatusHistory extends UlidBaseEntity {

    @ManyToOne(() => Order, (order) => order.id)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column({ type: 'int', enum: OrderStatusHistoryEnum, nullable: true })
    status: OrderStatusHistoryEnum;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'action_by' })
    actionBy: User;

}