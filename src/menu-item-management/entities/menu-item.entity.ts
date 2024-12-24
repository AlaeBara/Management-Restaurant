import { Category } from "src/category-item-management/entities/category.entity";
import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { MenuItemTag } from "./menu-item-tag.entity";
import { MenuItemFormula } from "./menu-item-formula.entity";
import { MenuItemPrice } from "./menu-item-price.entityt";
import { MenuItemTranslate } from "./menu-item-translation.enity";




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

    @Column({ type: 'boolean', default: false })
    hasFormulas: boolean; // if the menu item has formulas to track the quantity of the product and handel inventory automatically

    @ManyToMany(() => MenuItemTag, { eager: false })
    @JoinTable({ name: process.env.DATASET_PREFIX + 'item_menu_tag_relation' })
    tags: MenuItemTag[];

    @OneToMany(() => MenuItemFormula, (formula) => formula.menuItem, { nullable: true, eager: true, cascade: true})
    formulas: MenuItemFormula[];

    @OneToOne(() => MenuItemPrice, (menuItemPrice) => menuItemPrice.menuItem, { eager: true })
    @JoinColumn()
    price: MenuItemPrice;

    @OneToMany(() => MenuItemTranslate, (menuItemTranslate) => menuItemTranslate.menuItem, { eager: true, cascade: true })
    translates: MenuItemTranslate[];
}
