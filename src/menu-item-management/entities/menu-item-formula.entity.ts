import { BaseEntity } from "src/common/entities/base.entity";
import { AfterLoad, Column, Entity, Index, ManyToMany, ManyToOne } from "typeorm";
import { MenuItem } from "./menu-item.entity";
import { Product } from "src/product-management/entities/product.entity";
import { Unit } from "src/unit-management/entities/unit.entity";

@Entity(`${process.env.DATASET_PREFIX || ''}item_menu_formula`)
export class MenuItemFormula extends BaseEntity {
    @ManyToOne(() => Product, (product) => product.id, { nullable: false, eager: true })
    product: Product;

    productName: string;
    productId: string;

    @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
    currentQuantity: number;

    @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
    warningQuantity: number;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    quantityFormula: number;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    portionProduced: number;

    @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
    quantityRequiredPerPortion: number;

    @ManyToOne(() => Unit, (unit) => unit.id, { nullable: true, eager: true })
    unit: Unit;

    unitName: string;
    unitId: string;

    /*    @ManyToOne(() => MenuItem, (menuItem) => menuItem.id, { nullable: true })
       menuItem: MenuItem; */

    @ManyToOne(() => MenuItem, (menuItem) => menuItem.formulas, {
        eager: false,
        onDelete: 'CASCADE', // Ensure this is explicitly set
    })
    menuItem: MenuItem;

    @AfterLoad()
    setNames() {
        console.log(this.unit);
        this.productName = this.product.productName;
        this.productId = this.product.id;
        delete this.product;
        this.unitName = this.unit.unit;
        this.unitId = this.unit.id;
        delete this.unit;
    }
}