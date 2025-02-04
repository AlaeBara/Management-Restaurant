import { UlidBaseEntity } from "src/common/entities/ulid-base.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { ChoiceAttribute } from "./choice-attribute.entity";

@Entity(`${process.env.DATASET_PREFIX || ''}choice`)
export class Choice extends UlidBaseEntity {
    @Column({ type: 'varchar', length: 100 })
    value: string;

    @ManyToOne(() => ChoiceAttribute, (attribute) => attribute.choices, { eager: true })
    attribute: ChoiceAttribute;
}
