import { BaseEntity } from "src/common/entities/base.entity";
import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { MenuItemPrice } from "./menu-item-price.entityt";
import { MenuItemDiscount } from "./menu-item-discount.entity";

@Entity(`${process.env.DATASET_PREFIX || ''}item_menu_price_history`)
export class MenuItemPriceHistory extends BaseEntity {
    /* @ManyToOne(() => MenuItemPrice, (menuItemPrice) => menuItemPrice.id)
    price: MenuItemPrice; */



    @ManyToOne(() => MenuItemPrice, (menuItemPrice) => menuItemPrice.priceHistory, {
        eager: false,
        onDelete: 'CASCADE', // Ensure this is explicitly set
    })
    price: MenuItemPrice;

    @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
    oldPrice: number;

    @ManyToOne(() => MenuItemDiscount, (discount) => discount.id, { nullable: true, eager: true })
    discount: MenuItemDiscount;

    @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
    newPrice: number;

    @CreateDateColumn({ type: 'timestamp' })
    changedAt: Date;
}