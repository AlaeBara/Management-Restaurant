import { BaseEntity } from "src/common/entities/base.entity";
import { AfterLoad, Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { MenuItem } from "./menu-item.entity";
import { MenuItemDiscount } from "./menu-item-discount.entity";
import { MenuItemPriceHistory } from "./menu-item-price-history.entity";
import { DiscountStatus } from "../enums/discount-status.enum";

@Entity(`${process.env.DATASET_PREFIX || ''}item_menu_price`)
export class MenuItemPrice extends BaseEntity {
    @OneToOne(() => MenuItem, (menuItem) => menuItem.price) // Fix: Reference the price property
    menuItem: MenuItem;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    basePrice: number;

    @ManyToOne(() => MenuItemDiscount, (discount) => discount.id, { nullable: true, eager: true })
    discount: MenuItemDiscount;

    @OneToMany(() => MenuItemPriceHistory, (priceHistory) => priceHistory.id, { cascade: true })
    priceHistory: MenuItemPriceHistory[];

    finalPrice: number;

    @AfterLoad()
    async calculateFinalPrice() {
        if (this.discount.status === DiscountStatus.NO_DISCOUNT) {
            this.finalPrice = this.basePrice;
            return;
        }
        this.finalPrice = await this.discount.setDiscount(this.basePrice);
    }
}