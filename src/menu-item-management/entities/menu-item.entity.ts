import {
    AfterLoad,
    Column,
    Entity,
    Index,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany
} from "typeorm";

import { BaseEntity } from "src/common/entities/base.entity";
import { Category } from "src/category-management/entities/category.entity";
import { MenuItemTag } from "./menu-item-tag.entity";
import { MenuItemFormula } from "./menu-item-formula.entity";
import { MenuItemTranslate } from "./menu-item-translation.enity";
import { MediaLibrary } from "src/media-library-management/entities/media-library.entity";
import { DiscountStatus } from "../enums/discount-status.enum";
import { MenuItemDiscount } from "./menu-item-discount.entity";
import { DiscountMethod } from "../enums/discount-method";

@Entity(`${process.env.DATASET_PREFIX || ''}item_menu`)
@Index(['menuItemSku'])
export class MenuItem extends BaseEntity {

    @Column({ type: 'varchar', length: 15 })
    menuItemSku: string;

    @Column({ type: 'int', default: 0, nullable: true })
    quantity: number;

    @Column({ type: 'int' })
    warningQuantity: number;

    @Column({ type: 'boolean', default: false })
    hidden: boolean;

    @Column({ type: 'boolean' })
    isPublished: boolean;

    @Column({ type: 'boolean' })
    isDraft: boolean;

    @ManyToOne(() => Category, (category) => category.id, { nullable: true, eager: false })
    category: Category

    @Column({ type: 'boolean', default: false })
    hasRecipe: boolean; // if the menu item has formulas to track the quantity of the product and handel inventory automatically

    @ManyToMany(() => MenuItemTag, { nullable: true, eager: true })
    @JoinTable({ name: `${process.env.DATASET_PREFIX || ''}item_menu_tag_relation` })
    tags: MenuItemTag[];

    @ManyToMany(() => MediaLibrary, { nullable: true, eager: true })
    @JoinTable({ name: `${process.env.DATASET_PREFIX || ''}item_menu_image_relation` })
    images: MediaLibrary[];

    @OneToMany(() => MenuItemFormula, (formula) => formula.menuItem, { nullable: true, eager: true, cascade: true, orphanedRowAction: 'delete' })
    formulas: MenuItemFormula[];

    @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true, default: null })
    portionProduced: number;

    @OneToMany(
        () => MenuItemTranslate,
        (menuItemTranslate) => menuItemTranslate.menuItem,
        { eager: true, cascade: true, orphanedRowAction: 'delete' } // Properly configured
    )
    translates: MenuItemTranslate[];

    @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
    basePrice: number;

    @ManyToOne(() => MenuItemDiscount, (discount) => discount.id, { nullable: true, eager: true })
    discount: MenuItemDiscount;

    @Column({ type: 'varchar', enum: DiscountMethod, default: null, nullable: true })
    discountMethod: DiscountMethod | null;

    @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true, default: null })
    discountValue: number | null;

    finalPrice: number;

    @AfterLoad()
    async calculateFinalPrice() {
        if (this.discount && this.discount.status === DiscountStatus.IN_DISCOUNT) {
            this.finalPrice = await this.discount.setDiscount(this.basePrice);
            return;
        }
        this.finalPrice = this.basePrice;
    }
}
