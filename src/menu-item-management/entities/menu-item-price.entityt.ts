import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { MenuItem } from "./menu-item.entity";
import { MenuItemDiscount } from "./menu-item-discount.entity";
import { MenuItemPriceHistory } from "./menu-item-price-history.entity";

@Entity(`${process.env.DATASET_PREFIX || ''}item_menu_price`)
export class MenuItemPrice extends BaseEntity {
    @OneToOne(() => MenuItem, (menuItem) => menuItem.price) // Fix: Reference the price property
    menuItem: MenuItem;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    basePrice: number;

    @ManyToOne(() => MenuItemDiscount, (discount) => discount.id, { nullable: true, eager: true })
    discount: MenuItemDiscount;

    @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
    finalPrice: number;

    @OneToMany(() => MenuItemPriceHistory, (priceHistory) => priceHistory.id, { cascade: true })
    priceHistory: MenuItemPriceHistory[];
}