import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, Index, ManyToMany, ManyToOne } from "typeorm";
import { MenuItem } from "./menu-item.entity";
import { Product } from "src/product-management/entities/product.entity";
import { Unit } from "src/unit-management/entities/unit.entity";

@Entity(`${process.env.DATASET_PREFIX || ''}item_menu_formula`)
export class MenuItemFormula extends BaseEntity {
    @ManyToOne(() => Product, (product) => product.id, { nullable: true })
    product: Product;

    @Column({ type: 'varchar', length: 10 })
    currentQuantity: string;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    warningQuantity: number;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    quantityFormula: number;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    portionProduced: number;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    quantityRequiredPerPortion: number;

    @ManyToOne(() => Unit, (unit) => unit.id, { nullable: true })
    unit: Unit;

    @ManyToOne(() => MenuItem, (menuItem) => menuItem.formulas, { nullable: true })
    menuItem: MenuItem;
}
