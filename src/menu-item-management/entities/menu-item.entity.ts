import { Category } from "src/category-management/entities/category.entity";
import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { MenuItemTag } from "./menu-item-tag.entity";
import { MenuItemFormula } from "./menu-item-formula.entity";
import { MenuItemPrice } from "./menu-item-price.entityt";
import { MenuItemTranslate } from "./menu-item-translation.enity";
import { MediaLibrary } from "src/media-library-management/entities/media-library.entity";

@Entity(`${process.env.DATASET_PREFIX || ''}item_menu`)
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

    @Column({ type: 'boolean', default: false })
    hasFormulas: boolean; // if the menu item has formulas to track the quantity of the product and handel inventory automatically

    @ManyToMany(() => MenuItemTag, { eager: true })
    @JoinTable({ name: `${process.env.DATASET_PREFIX || ''}item_menu_tag_relation` })
    tags: MenuItemTag[];

    @ManyToMany(() => MediaLibrary, { eager: true })
    @JoinTable({ name: `${process.env.DATASET_PREFIX || ''}item_menu_image_relation` })
    images: MediaLibrary[];

    @OneToMany(() => MenuItemFormula, (formula) => formula.menuItem, { nullable: true, eager: true, cascade: true, orphanedRowAction: 'delete' })
    formulas: MenuItemFormula[];

    @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true, default: null })
    portionProduced: number;

    @OneToOne(() => MenuItemPrice, (menuItemPrice) => menuItemPrice.menuItem, {
        eager: true,
        cascade: true,
        orphanedRowAction: 'delete', // Automatically deletes the orphaned row
    })
    @JoinColumn({ name: `${process.env.DATASET_PREFIX || ''}item_menu_price_id` })
    price: MenuItemPrice;

    @OneToMany(
        () => MenuItemTranslate,
        (menuItemTranslate) => menuItemTranslate.menuItem,
        { eager: true, cascade: true, orphanedRowAction: 'delete' } // Properly configured
    )
    translates: MenuItemTranslate[];
}
