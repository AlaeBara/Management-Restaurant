import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, Index, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { MenuItem } from "./menu-item.entity";
import { Product } from "src/product-management/entities/product.entity";
import { Unit } from "src/unit-management/entities/unit.entity";
import { DiscountType } from "../enums/item-menu-discount.enum";
import { MenuItemDiscount } from "./menu-item-discount.entity";
import { MenuItemPriceHistory } from "./menu-item-price-history.entity";

@Entity(`${process.env.DATASET_PREFIX || ''}item_menu_price`)
export class MenuItemPrice extends BaseEntity {
    @OneToOne(() => MenuItem, (menuItem) => menuItem.price)
    menuItem: MenuItem;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    basePrice: number;

    @ManyToOne(() => MenuItemDiscount, (discount) => discount.id, { nullable: true })
    discount: MenuItemDiscount;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    finalPrice: number;

    @OneToMany(() => MenuItemPriceHistory, (priceHistory) => priceHistory.price)
    priceHistory: MenuItemPriceHistory[];
}