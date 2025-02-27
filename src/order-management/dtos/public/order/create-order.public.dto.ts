import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, ValidateNested, Min, IsArray, IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PublicCreateOrderItemDto } from '../order-item/create-order-item.public.dto';
import { ServiceType } from 'src/order-management/enums/service-type.enum';
import { DeliveryType } from 'src/order-management/enums/order-type.enum';
import { DiscountType } from 'src/order-management/enums/discount.enum';

export class PublicCreateOrderDto {
    @ApiPropertyOptional({ description: 'ID of the table' })
    @IsOptional()
    @IsUUID()
    tableId?: string;

    @ApiProperty({ description: 'ID of the server/staff member' })
    @IsUUID()
    @IsOptional()
    servedById: string;

    @ApiPropertyOptional({ description: 'ID of the client' })
    @IsOptional()
    @IsUUID()
    clientId?: string;

    @ApiPropertyOptional({ description: 'ID of the guest' })
    @IsOptional()
    @IsUUID()
    guestId?: string;

    @ApiPropertyOptional({ description: 'Number of seats at the table' })
    @IsOptional()
    @IsNumber()
    @Min(1)
    numberOfSeats?: number;

    @ApiProperty({ enum: ServiceType, default: ServiceType.SERVICE_A_LA_FOIS })
    @IsEnum(ServiceType)
    @IsOptional()
    serviceType: ServiceType;

    @ApiPropertyOptional({ description: 'Additional notes for the order' })
    @IsOptional()
    @IsString()
    note?: string;

    @ApiProperty({ enum: DeliveryType, default: DeliveryType.ON_SITE })
    @IsEnum(DeliveryType)
    @IsOptional()
    deliveryType: DeliveryType;

    @ApiPropertyOptional({ enum: DiscountType })
    @IsOptional()
    @IsEnum(DiscountType)
    discountType?: DiscountType;

    @ApiPropertyOptional({ description: 'Discount amount or percentage' })
    @IsOptional()
    @IsNumber()
    discountValue?: number;

    @ApiPropertyOptional({ description: 'Reason for the discount' })
    @IsOptional()
    @IsString()
    discountRaison?: string;

    @ApiProperty({ description: 'Total amount for the order' })
    @IsNumber()
    @IsNotEmpty()
    totalAmount: number;

    @ApiPropertyOptional({ description: 'Total additional price' })
    @IsOptional()
    @IsNumber()
    totalAditionalPrice?: number;

    @ApiProperty({ description: 'Is this a transfer order?' })
    @IsBoolean()
    @IsOptional()
    isTransfer: boolean;

    @ApiProperty({ type: [PublicCreateOrderItemDto], description: 'Order items' })
    @IsArray()
    //@ValidateNested({ each: true })
    @Type(() => PublicCreateOrderItemDto)
    items: PublicCreateOrderItemDto[];
}