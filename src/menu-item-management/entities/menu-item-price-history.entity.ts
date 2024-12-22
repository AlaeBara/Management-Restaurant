import { BaseEntity } from "src/common/entities/base.entity";
import { Column, CreateDateColumn, Entity, Index, ManyToMany, ManyToOne } from "typeorm";
import { MenuItem } from "./menu-item.entity";
import { Product } from "src/product-management/entities/product.entity";
import { Unit } from "src/unit-management/entities/unit.entity";
import { DiscountType } from "../enums/item-menu-discount.enum";
import { MenuItemDiscount } from "./menu-item-discount.entity";
import { MenuItemPrice } from "./menu-item-price.entityt";

@Entity(`${process.env.DATASET_PREFIX || ''}item_menu_price_history`)
export class MenuItemPriceHistory extends BaseEntity {
    @ManyToOne(() => MenuItemPrice, (menuItemPrice) => menuItemPrice.id)
    price: MenuItemPrice;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    oldPrice: number;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    newPrice: number;

    @CreateDateColumn({ type: 'timestamp' })
    changedAt: Date;
}