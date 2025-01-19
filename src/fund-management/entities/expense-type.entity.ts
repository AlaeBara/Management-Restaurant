import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity(`${process.env.DATASET_PREFIX || ''}expense_types`)
export class ExpenseType extends BaseEntity {
    @Column()
    name: string;
}

