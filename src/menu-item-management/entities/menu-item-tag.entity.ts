import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, Index, ManyToMany } from "typeorm";
import { MenuItem } from "./menu-item.entity";

@Entity(`${process.env.DATASET_PREFIX || ''}item_menu_tag`)
@Index(['tag'])
export class MenuItemTag extends BaseEntity {
    @Column({ type: 'varchar', length: 30 })
    tag: string;

}
