import {
    Column,
    Entity,
    Index
} from "typeorm";

import { UlidBaseEntity } from "src/common/entities/ulid-base.entity";

@Entity(`${process.env.DATASET_PREFIX || ''}guests`)
@Index(['id', 'fullname', 'phoneNumber'])
export class Guest extends UlidBaseEntity {

    @Column({ type: "varchar", length: 100, nullable: true })
    fullname: string | null;

    @Column({ type: "varchar", length: 20, nullable: true })
    phoneNumber: string | null;

    @Column({ type: "varchar", length: 100, nullable: true })
    email: string | null;

}
