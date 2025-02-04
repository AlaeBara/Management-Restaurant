import { UlidBaseEntity } from "src/common/entities/ulid-base.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { MenuItem } from "../menu-item.entity";
import { ChoiceAttribute } from "./choice-attribute.entity";
import { Choice } from "./choice.entity";

@Entity(`${process.env.DATASET_PREFIX || ''}menu_item_choices`)
export class MenuItemChoices extends UlidBaseEntity {

    @ManyToOne(() => MenuItem, (menuItem) => menuItem.choices)
    menuItem: MenuItem;

    @ManyToOne(() => Choice, (choice) => choice.id, { eager: true })
    choice: Choice;

    @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
    additionalPrice: number;

}
