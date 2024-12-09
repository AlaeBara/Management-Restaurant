import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { GenericService } from "src/common/services/generic.service";
import { InventoryMovement } from "../entities/inventory-movement.entity";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CreateInventoryMovementDto } from "../dtos/inventory-movement/create-inventory-movement.dto";
import { Inventory } from "../entities/inventory.entity";
import { getMovementAction, MovementType } from "../enums/movement_type.enum";
import { InventoryService } from "./inventory.service";
import { CreateInvenotryTransfer } from "../dtos/inventory-movement/create-inventory-transfer.dto";
import { UserService } from "src/user-management/services/user/user.service";

@Injectable()
export class InventoryMovementService extends GenericService<InventoryMovement> {
    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(InventoryMovement)
        readonly inventoryMovementRepository: Repository<InventoryMovement>,
        @InjectRepository(Inventory)
        private readonly inventoryRepository: Repository<Inventory>,
        @Inject()
        private readonly inventoryService: InventoryService,
        @Inject()
        private readonly userService: UserService
    ) {
        super(dataSource, InventoryMovement, 'inventory-movement');
    }

    /**
     * Adjusts the quantity of a single inventory record
     * @param Invenetory - The inventory record to adjust
     * @param quantity - The quantity to adjust by
     * @param movementAction - The type of adjustment ('increase' or 'decrease')
     * @throws BadRequestException if the movement action is invalid
     */
    async executeAdjustment(Invenetory: Inventory, quantity: number, movementAction: string) {
        const totalQuantity = Number(Invenetory.totalQuantity);
        switch (movementAction) {
            case 'increase':
                Invenetory.totalQuantity = totalQuantity + Number(quantity);
                break;
            case 'decrease':
                Invenetory.totalQuantity = totalQuantity - Number(quantity);
                break;
            default:
                throw new BadRequestException(`Invalid movement action: ${movementAction}`);
        }

        await this.inventoryRepository.save(Invenetory);
    }

    /**
     * Validates the quantity of an inventory movement
     * @param quantity - The quantity to validate
     * @throws BadRequestException if the quantity is not greater than 0
     */
    async validateQuantity(quantity: number): Promise<void> {
        if (quantity <= 0) throw new BadRequestException('Quantity must be greater than 0');
    }

    /**
     * Initializes a new inventory movement object with validation
     * @param InventoryMovementDto - The DTO containing movement details like quantity and type
     * @param request - The HTTP request object containing user information
     * @returns Promise<InventoryMovement> - The initialized inventory movement object
     * @throws BadRequestException if trying to decrease more quantity than available
     */
    async initializeInventoryMovement(InventoryMovementDto: CreateInventoryMovementDto, request: Request): Promise<InventoryMovement> {
        // Create a new inventory movement object from the DTO
        const inventoryMovementObject = this.inventoryMovementRepository.create(InventoryMovementDto);

        //If the movement action is not provided, it's automatically set based on the movement type
        inventoryMovementObject.movementAction = InventoryMovementDto.movementAction ? InventoryMovementDto.movementAction : getMovementAction(InventoryMovementDto.movementType);
        
        //The movement action must be either 'increase' or 'decrease'
        if (['increase', 'decrease'].includes(inventoryMovementObject.movementAction) === false) {
            throw new BadRequestException('Invalid movement action');
        }

        // Fetch the related inventory record with additional options
        const Inventory = await this.inventoryService.findOneByIdWithOptions(InventoryMovementDto.inventoryId);
        inventoryMovementObject.inventory = Inventory;

        // A transfer is not allowed as it's handled by a dedicated endpoint
        if (inventoryMovementObject.movementType === MovementType.TRANSFER) {
            throw new BadRequestException('Le transfert n\'est pas autorisé');
        }

        // Validate that we're not trying to decrease more than what's available
        if (inventoryMovementObject.movementAction === 'decrease' && inventoryMovementObject.quantity > Inventory.totalQuantity) {
            throw new BadRequestException('Quantity is greater than the inventory total quantity');
        }

        // Set the user who initiated this movement
        inventoryMovementObject.createdBy = await this.userService.findOneByIdWithOptions(request['user'].sub);
        return inventoryMovementObject;
    }

    /**
     * Creates a new inventory movement and updates inventory quantities accordingly
     * @param InventoryMovementDto - The DTO containing movement details like quantity, type and inventory IDs
     * @param request - The HTTP request object containing user information
     * @throws BadRequestException if:
     * - Source and destination inventories are for different products
     * - Trying to transfer more quantity than available in source/destination
     */
    async createInvenotryMovement(InventoryMovementDto: CreateInventoryMovementDto, request: Request) {
        // Initialize the movement object with basic validation
        await this.validateQuantity(InventoryMovementDto.quantity);
        const inventoryMovement = await this.initializeInventoryMovement(InventoryMovementDto, request);
        await this.inventoryMovementRepository.save(inventoryMovement);
        await this.executeAdjustment(inventoryMovement.inventory, inventoryMovement.quantity, InventoryMovementDto.movementAction);
    }

    /**
     * Validates the transfer of inventory between two inventories.
     * @param InventoryMovement - The inventory movement object containing the source and destination inventories and the quantity to transfer
     * @throws BadRequestException if:
     * - Source and destination inventories are for different products
     * - Trying to transfer more quantity than available in source/destination
     */
    async validateTransferInventory(InventoryMovement: InventoryMovement) {
        // Validate source and destination are not the same
        if (InventoryMovement.inventory.id === InventoryMovement.transfertToInventory.id) {
            throw new BadRequestException('Le transfert ne peut pas être effectué entre le même inventaire source et destination.');
        }

        // Validate products match between source and destination
        if (InventoryMovement.inventory.productId !== InventoryMovement.transfertToInventory.productId) {
            throw new BadRequestException('Les inventaires source et destination doivent correspondre au même produit.');
        }

        // Validate source inventory has enough quantity
        if (InventoryMovement.quantity > InventoryMovement.inventory.totalQuantity) {
            throw new BadRequestException('La quantité demandée dépasse la quantité totale disponible dans l\'inventaire source.');
        }
    }

    /**
     * Creates a new inventory transfer and updates inventory quantities accordingly
     * @param InventoryTransferDto - The DTO containing transfer details like quantity, source and destination inventories
     * @param request - The HTTP request object containing user information
     * @throws BadRequestException if:
     * - Source and destination inventories are for different products
     * - Trying to transfer more quantity than available in source/destination
     */
    async createTransfer(InventoryTransferDto: CreateInvenotryTransfer, request: Request) {
        // Validate the quantity being transferred
        await this.validateQuantity(InventoryTransferDto.quantity);

        // Fetch the source and destination inventories
        const sourceInventory = await this.inventoryService.findOneByIdWithOptions(InventoryTransferDto.inventoryId);
        const destinationInventory = await this.inventoryService.findOneByIdWithOptions(InventoryTransferDto.transfertToInventoryId);

        // Fetch the user who initiated this transfer
        const createBy = await this.userService.findOneByIdWithOptions(request['user'].sub);

        // Create a new inventory movement object with the transfer details
        const inventoryMovement = this.inventoryMovementRepository.create({
            ...InventoryTransferDto,
            inventory: sourceInventory,
            transfertToInventory: destinationInventory,
            createdBy: createBy
        });

        // Validate the transfer by checking that the source and destination inventories are for the same product and that the quantity is not greater than the available quantity in the source/destination
        await this.validateTransferInventory(inventoryMovement);

        // Save the new inventory movement object
        await this.inventoryMovementRepository.save(inventoryMovement);

        // Update the source inventory by decreasing the quantity by the transferred quantity
        await this.executeAdjustment(inventoryMovement.inventory, InventoryTransferDto.quantity, 'decrease');
        // Update the destination inventory by increasing the quantity by the transferred quantity
        await this.executeAdjustment(inventoryMovement.transfertToInventory, InventoryTransferDto.quantity, 'increase');
    }

}