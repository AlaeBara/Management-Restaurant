import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, isNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { MovementType } from "src/inventory-managemet/enums/movement_type.enum";


export class CreateInventoryMovementDto {

    @ApiProperty({ description: 'The Invenetory id of the Movement', required: true , example: '1234567890'})
    @IsUUID()
    @IsNotEmpty()
    inventoryId: string;

    @ApiProperty({ description: 'The destinationInventory id of the Movement For Transfert Movement Type', required: false , example: '1234567890'})
    @IsUUID()
    @IsOptional()
    destinationInventoryId: string;   

    @ApiProperty({ description: 'The Quantity of the Movement', required: true , example: '2'})
    @IsNumber()
    @IsNotEmpty()
    quantity :number

    @ApiProperty({ description: 'The Movement Type of the Movement', required: true , example: 'INVENTORY_INITIAL'})
    @IsNotEmpty()
    @IsEnum(MovementType)
    movementType: MovementType
    
    @ApiProperty({ description: 'The Action type of the Movement', required: false , example: 'increase'})
    @IsOptional()
    @IsEnum(['increase','decrease'])
    movementAction: string

    @ApiProperty({ description: 'The Movement Date of the Movement', required: false , example: '2024-11-24 14:00:00'})
    @IsOptional()
    movementDate: Date

    @ApiProperty({ description: 'The Movement Expiration Date of the Movement', required: false , example: '2025-01-21 14:00:00'})
    @IsOptional()
    dateExpiration: Date

    @ApiProperty({ description: 'The Notes of the Movement', required: false , example: 'This is a note'})
    @IsString()
    @IsOptional()
    notes: string | null;

    @ApiProperty({ description: 'The Reason of the Movement', required: false , example: 'This is a reason'})
    @IsString()
    @IsOptional()
    reason: string | null;

}