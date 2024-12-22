import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, Index, ManyToMany, ManyToOne } from "typeorm";
import { MenuItem } from "./menu-item.entity";
import { Product } from "src/product-management/entities/product.entity";
import { Unit } from "src/unit-management/entities/unit.entity";
import { DiscountType } from "../enums/item-menu-discount.enum";

@Entity(`${process.env.DATASET_PREFIX || ''}item_menu_discount`)
export class MenuItemDiscount extends BaseEntity {

    @Column({ type: 'varchar', length: 15 })
    discountSku: string;

    @Column({ type: 'varchar', default: DiscountType.PERCENTAGE })
    discountType: DiscountType;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    discountValue: number;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', nullable: true })
    startDateTime: Date;

    @Column({ type: 'timestamp', nullable: true })
    endDateTime: Date;

}