import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { GenericService } from "src/common/services/generic.service";
import { InventoryMovement } from "../entities/inventory-movement.entity";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CreateInventoryMovementDto } from "../dtos/inventory-movement/create-inventory-movement.dto";
import { Inventory } from "../entities/inventory.entity";
import { getMovementAction } from "../enums/movement_type.enum";
import { InventoryService } from "./inventory.service";

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

    async adjustInventory(Invenetory: Inventory, quantity: number, movementAction: string) {
        switch (movementAction) {
            case 'increase':
                Invenetory.totalQuantity += quantity;
                break;
            case 'decrease':
                Invenetory.totalQuantity -= quantity;
                break;
        }
        await this.inventoryRepository.save(Invenetory);
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

    async createInvenotryMovement(InventoryMovementDto: CreateInventoryMovementDto, request: Request) {
        const inventoryMovementObject = await this.initializeInventoryMovement(InventoryMovementDto, request);
        await this.inventoryMovementRepository.save(inventoryMovementObject);
        await this.adjustInventory(inventoryMovementObject.inventory, inventoryMovementObject.quantity, inventoryMovementObject.movementAction);
    }
}