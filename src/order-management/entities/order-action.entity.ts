import { UlidBaseEntity } from "src/common/entities/ulid-base.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Order } from "./order.entity";
import { User } from "src/user-management/entities/user.entity";
import { Client } from "src/client-management/entities/client.entity";
import { Guest } from "./guest.entity";

@Entity(`${process.env.DATASET_PREFIX || ''}order_actions`)
@Index(['action'])
export class OrderAction extends UlidBaseEntity {

    @ManyToOne(() => Order, (order) => order.id)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column({ type: 'varchar', length: 255 })
    action: string;

    @ManyToOne(() => User, (user) => user.id, { nullable: true })
    @JoinColumn({ name: 'action_by' })
    actionBy: User | null;

    @ManyToOne(() => Client, (client) => client.id, { nullable: true })
    @JoinColumn({ name: 'client_id' })
    client: Client | null;

    @ManyToOne(() => Guest, (guest) => guest.id, { nullable: true })
    @JoinColumn({ name: 'guest_id' })
    guest: Guest | null;

}
