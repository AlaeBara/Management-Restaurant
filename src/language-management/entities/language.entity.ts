import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, Index } from "typeorm";

@Entity(process.env.DATASET_PREFIX + 'languages')
@Index(['label', 'value'])
export class Language extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    label: string;

    @Column({ type: 'varchar', length: 50 })
    value: string;
}
