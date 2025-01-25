import {
    Column,
    Entity,
    Index
} from "typeorm";

import { UlidBaseEntity } from "src/common/entities/ulid-base.entity";

@Entity(`${process.env.DATASET_PREFIX || ''}payment_method`)
@Index(['id', 'name'])
export class PaymentMethod extends UlidBaseEntity {

    @Column({ type: 'varchar', nullable: true })
    name: string;

    @Column({ type: 'boolean', default: false })
    protected: boolean;

}
