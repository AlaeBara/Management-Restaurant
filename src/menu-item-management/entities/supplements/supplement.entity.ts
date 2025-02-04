import { UlidBaseEntity } from "src/common/entities/ulid-base.entity";
import { Column, Entity } from "typeorm";

@Entity(`${process.env.DATASET_PREFIX || ''}item_menu_supplement`)
export class Supplement extends UlidBaseEntity {
    @Column({ type: 'varchar', length: 100 })
    name: string;
}
