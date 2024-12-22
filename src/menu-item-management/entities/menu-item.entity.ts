import { Category } from "src/category-item-management/entities/category.entity";
import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne} from "typeorm";
import { MenuItemTag } from "./menu-item-tag.entity";
import { MenuItemFormula } from "./menu-item-formula.entity";
import { MenuItemPrice } from "./menu-item-price.entityt";
import { MenuItemTranslate } from "./menu-item-translation.enity";
import { Transform } from "class-transformer";



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

    @Column({ type: 'varchar', nullable: true })
    avatar: string;

    @ManyToMany(() => MenuItemTag, { eager: false })
    @JoinTable({ name: process.env.DATASET_PREFIX + 'item_menu_tag_relation' })
    tags: MenuItemTag[];

    @OneToMany(() => MenuItemFormula, (formula) => formula.id, { nullable: true })
    formulas: MenuItemFormula[];

    @OneToOne(() => MenuItemPrice, (menuItemPrice) => menuItemPrice.menuItem)
    @JoinColumn()
    price: MenuItemPrice;

    @OneToMany(() => MenuItemTranslate, (menuItemTranslate) => menuItemTranslate.menuItem, { eager: true })
    translates: MenuItemTranslate[];
}
