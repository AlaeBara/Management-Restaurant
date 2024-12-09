import { BaseEntity } from 'src/common/entities/base.entity';
import { Product } from 'src/product-management/entities/product.entity';
import { Storage } from 'src/storage-management/entities/storage.entity';
import { AfterLoad, BeforeInsert, CreateDateColumn, Index, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { Column, Entity } from 'typeorm';
import { Inventory } from './inventory.entity';
import { getMovementAction, MovementType } from '../enums/movement_type.enum';
import { User } from 'src/user-management/entities/user.entity';

@Entity(process.env.DATASET_PREFIX + 'inventory-movement')
@Index(['id', 'inventory', 'movementAction'])
export class InventoryMovement extends BaseEntity {
    @ManyToOne(() => Inventory, { eager: true })
    @JoinColumn({ name: 'inventoryId' })
    inventory: Inventory;

    @RelationId((inventoryMovement: InventoryMovement) => inventoryMovement.inventory)
    inventoryId: string;

    @Column({ type: 'enum', enum: MovementType })
    movementType: MovementType;

    @Column()
    movementAction: string;

    @Column()
    quantity: number;

    @ManyToOne(() => Inventory, { eager: true, nullable: true })
    @JoinColumn({ name: 'transfertToInventoryId' })
    transfertToInventory: Inventory;

    @RelationId((inventoryMovement: InventoryMovement) => inventoryMovement.transfertToInventory)
    transfertToInventoryId: string;

    @CreateDateColumn({ type: 'timestamp', nullable: true })
    movementDate: Date

    @Column({ nullable: true })
    notes: string

    @Column({ nullable: true })
    reason: string

    @ManyToOne(() => User, { eager: true, nullable: true })
    @JoinColumn({ name: 'createdBy' })
    createdBy: User;

    @BeforeInsert()
    setMovementAction() {
        this.movementAction =  this.movementAction ? this.movementAction : getMovementAction(this.movementType);
    }
}