import { Category } from "src/category-item-management/entities/category.entity";
import { BaseEntity } from "src/common/entities/base.entity";
import { AfterLoad, Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, RelationId, Unique } from "typeorm";
import { ItemMenuTag } from "../enums/item-menu-tag.enum";
import { MenuItemTag } from "./menu-item-tag.entity";



@Entity(process.env.DATASET_PREFIX + 'item_menu')
@Index(['menuItemSku'])
export class MenuItem extends BaseEntity {

    @Column({ type: 'varchar', length: 15 })
    menuItemSku: string;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ type: 'int' })
    warningQuantity: number;

    @Column({ type: 'boolean' })
    isPublished: boolean;

    @Column({ type: 'boolean' })
    isDraft: boolean;

    @ManyToOne(() => Category, (category) => category.id, { eager: false })
    category: Category

    @ManyToMany(() => MenuItemTag, { eager: false })
    @JoinTable({ name: process.env.DATASET_PREFIX + 'item_menu_tag_relation' })
    tags: MenuItemTag[];

    @Column({ type: 'varchar', nullable: true })
    avatar: string;

}
