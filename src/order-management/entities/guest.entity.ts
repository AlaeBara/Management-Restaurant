import {
    Column,
    Entity,
    Index
} from "typeorm";

import { UlidBaseEntity } from "src/common/entities/ulid-base.entity";

@Entity(`${process.env.DATASET_PREFIX || ''}guests`)
@Index(['id', 'fullname', 'phoneNumber', 'email'])
export class Guest extends UlidBaseEntity {
    @Column({ type: "varchar", length: 255 })
    fullname: string;

    @Column({ type: "varchar", length: 255 })
    phoneNumber: string;

    @Column({ type: "varchar", length: 255 })
    email: string;
}
