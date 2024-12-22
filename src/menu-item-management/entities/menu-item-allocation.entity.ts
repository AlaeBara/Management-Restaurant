import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { MenuItemFormula } from "./menu-item-formula.entity";
import { MenuItemAllocationMovementAction } from "../enums/item-menu-allocation-movement.enum";
import { InventoryMovement } from "src/inventory-managemet/entities/inventory-movement.entity";

@Entity(`${process.env.DATASET_PREFIX || ''}item_menu_allocation`)
export class MenuItemAllocationMovement extends BaseEntity {

    @ManyToOne(() => MenuItemFormula, (menuItemFormula) => menuItemFormula.id)
    menuItemFormula: MenuItemFormula;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    quantity: number;

    @Column({ type: 'enum', enum: MenuItemAllocationMovementAction })
    action: MenuItemAllocationMovementAction;

    @ManyToOne(() => InventoryMovement, (inventoryMovement) => inventoryMovement.id)
    inventoryMovement: InventoryMovement;
}