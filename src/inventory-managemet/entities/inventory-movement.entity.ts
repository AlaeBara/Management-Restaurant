import { BaseEntity } from 'src/common/entities/base.entity';
import { Product } from 'src/product-management/entities/product.entity';
import { Storage } from 'src/storage-management/entities/storage.entity';
import { AfterLoad, BeforeInsert, Index, JoinColumn, ManyToOne, RelationId } from 'typeorm';
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

    /* @ManyToOne(() => Storage, { nullable: true })
    @JoinColumn({ name: 'sourceStorageId' })
    sourceStorage: Storage;

    @RelationId((inventoryMovement: InventoryMovement) => inventoryMovement.sourceStorage)
    sourceStorageId: string;

    @ManyToOne(() => Storage, { nullable: true })
    @JoinColumn({ name: 'destinationStorageId' })
    destinationStorage: Storage;

    @RelationId((inventoryMovement: InventoryMovement) => inventoryMovement.destinationStorage)
    destinationStorageId: string; */

    @ManyToOne(() => Inventory, { nullable: true })
    @JoinColumn({ name: 'destinationInventoryId' })
    destinationInventory: Inventory;

    @RelationId((inventoryMovement: InventoryMovement) => inventoryMovement.destinationInventory)
    destinationInventoryId: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'userId' })
    movedBy: User

    @RelationId((inventoryMovement: InventoryMovement) => inventoryMovement.movedBy)
    movedByUserId: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    movementDate: Date

    @Column({ nullable: true })
    notes: string

    @Column({ nullable: true })
    reason: string

    @BeforeInsert()
    setMovementAction() {
        this.movementAction = getMovementAction(this.movementType);
    }

}