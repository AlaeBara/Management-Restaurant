import { Column, Entity, Unique, ManyToOne, JoinColumn } from "typeorm";

import { BaseEntity } from "src/common/entities/base.entity";
import { MenuItem } from "./menu-item.entity";
import { Product } from "src/product-management/entities/product.entity";
import { Unit } from "src/unit-management/entities/unit.entity";
import { Inventory } from "src/inventory-managemet/entities/inventory.entity";

@Entity(`${process.env.DATASET_PREFIX || ''}item_menu_recipe`)
@Unique(['menuItem', 'product'])
export class MenuItemRecipe extends BaseEntity {

    @ManyToOne(() => Product, (product) => product.id, { nullable: false, eager: true })
    product: Product;

    @ManyToOne(() => Inventory, (inventory) => inventory.id, { nullable: true, eager: true })
    inventory: Inventory;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    ingredientQuantity: number;

    @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
    quantityRequiredPerPortion: number;

    @ManyToOne(() => Unit, (unit) => unit.id, { nullable: false, eager: true })
    unit: Unit;

    @ManyToOne(() => MenuItem, (menuItem) => menuItem.recipe, {
        eager: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'menuItemId' })
    menuItem: MenuItem;
}