import { UlidBaseEntity } from "src/common/entities/ulid-base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Choice } from "./choice.entity";

@Entity(`${process.env.DATASET_PREFIX || ''}choice_attribute`)
export class ChoiceAttribute extends UlidBaseEntity {

    @Column({ type: 'varchar', length: 100 })
    attribute: string;

    @OneToMany(() => Choice, (choice) => choice.attribute)
    choices: Choice[];
}
