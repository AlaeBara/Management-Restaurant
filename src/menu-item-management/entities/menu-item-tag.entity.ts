import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, Index } from "typeorm";

@Entity(`${process.env.DATASET_PREFIX || ''}item_menu_tag`)
@Index(['tag'])
export class MenuItemTag extends BaseEntity {

    @Column({
        type: 'varchar',
        length: 30
    })
    tag: string;

    // cannot delete tags created by the system
    @Column({
        type: 'boolean',
        default: false
    })
    isProtected: boolean;

}
