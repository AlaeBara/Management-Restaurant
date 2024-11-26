import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { GenericService } from "src/common/services/generic.service";
import { InventoryMovement } from "../entities/inventory-movement.entity";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CreateInventoryMovementDto } from "../dtos/inventory-movement/create-inventory-movement.dto";
import { Inventory } from "../entities/inventory.entity";
import { getMovementAction, MovementType } from "../enums/movement_type.enum";
import { InventoryService } from "./inventory.service";
import { Product } from "src/product-management/entities/product.entity";
import { log } from "console";

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
    async adjustInventory(Invenetory: Inventory, quantity: number, movementAction: string) {
        switch (movementAction) {
            case 'increase':
                Invenetory.totalQuantity += quantity;
                break;
            case 'decrease':
                Invenetory.totalQuantity -= quantity;
                break;
            default:
                throw new BadRequestException(`Invalid movement action: ${movementAction}`);
        }

        await this.inventoryRepository.save(Invenetory);
    }

    /**
     * Transfers inventory quantity between two inventory records
     * @param sourceInventory - The source inventory to transfer from
     * @param destinationInventory - The destination inventory to transfer to  
     * @param quantity - The quantity to transfer
     * @param movementAction - The type of transfer ('increase' transfers from destination to source, 'decrease' transfers from source to destination)
     * @throws BadRequestException if the movement action is invalid
     */
    async TransferInventory(sourceInventory: Inventory, destinationInventory: Inventory, quantity: number, movementAction: string) {
        switch (movementAction) {
            case 'increase':
                sourceInventory.totalQuantity += quantity;
                destinationInventory.totalQuantity -= quantity;
                break;
            case 'decrease':
                sourceInventory.totalQuantity -= quantity;
                destinationInventory.totalQuantity += quantity;
                break;
            default:
                throw new BadRequestException(`Invalid movement action: ${movementAction}`);
        }

        await this.inventoryRepository.save(sourceInventory);
        await this.inventoryRepository.save(destinationInventory);
    }

    /**
     * Handles validation and setup for inventory transfers between locations
     * @param InventoryMovement - The inventory movement object containing transfer details
     * @param destinationInventoryId - ID of the destination inventory location
     * @throws BadRequestException if:
     * - Source and destination inventories are for different products
     * - For transfer in, if destination doesn't have enough quantity
     */
    async handleTransferInventory(InventoryMovement: InventoryMovement, destinationInventoryId: string) {
        // Get the destination inventory
        InventoryMovement.destinationInventory = await this.inventoryService.findOneByIdWithOptions(destinationInventoryId);

        // Validate products match between source and destination
        if (InventoryMovement.inventory.productId != InventoryMovement.destinationInventory.productId) {
            throw new BadRequestException('Source and destination inventory must be for the same product')
        }

        // For transfer in, validate destination has enough quantity
        if (InventoryMovement.movementType === MovementType.TRANSFER_IN) {
            if (InventoryMovement.quantity > InventoryMovement.destinationInventory.totalQuantity)
                throw new BadRequestException('Quantity is greater than the inventory total quantity');
        }
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

        // Fetch the related inventory record with additional options
        const Inventory = await this.inventoryService.findOneByIdWithOptions(InventoryMovementDto.inventoryId);
        inventoryMovementObject.inventory = Inventory;

        // Validate that we're not trying to decrease more than what's available
        if (getMovementAction(InventoryMovementDto.movementType) === 'decrease' && InventoryMovementDto.quantity > Inventory.totalQuantity) {
            throw new BadRequestException('Quantity is greater than the inventory total quantity');
        }

        // Set the user who initiated this movement
        inventoryMovementObject.movedBy = request['user'].sub;
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
        const inventoryMovementObject = await this.initializeInventoryMovement(InventoryMovementDto, request);

        // Handle inventory transfers
        if (InventoryMovementDto.movementType === MovementType.TRANSFER_IN || InventoryMovementDto.movementType === MovementType.TRANSFER_OUT) {
            // Handle transfer inventory
            await this.handleTransferInventory(inventoryMovementObject, InventoryMovementDto.destinationInventoryId);
            // Save movement and update both inventories
            await this.inventoryMovementRepository.save(inventoryMovementObject);
            await this.TransferInventory(inventoryMovementObject.inventory, inventoryMovementObject.destinationInventory, inventoryMovementObject.quantity, inventoryMovementObject.movementAction)
        } else {
            // For non-transfer movements, save and adjust single inventory
            await this.inventoryMovementRepository.save(inventoryMovementObject);
            await this.adjustInventory(inventoryMovementObject.inventory, inventoryMovementObject.quantity, inventoryMovementObject.movementAction);
        }
    }
}