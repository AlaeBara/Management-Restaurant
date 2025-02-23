import { PartialType } from '@nestjs/swagger';
import { PublicCreateOrderItemDto } from './create-order-item.public.dto';
import { IsBoolean, IsOptional, IsString, IsUUID, IsDate } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PublicUpdateOrderItemDto extends PartialType(PublicCreateOrderItemDto) {
    @ApiPropertyOptional({ description: 'Whether the item has been refunded' })
    @IsOptional()
    @IsBoolean()
    isRefunded?: boolean;

    @ApiPropertyOptional({ description: 'ID of the user who processed the refund' })
    @IsOptional()
    @IsUUID()
    refundedById?: string;

    @ApiPropertyOptional({ description: 'When the refund was processed' })
    @IsOptional()
    @IsDate()
    refundedAt?: Date;

    @ApiPropertyOptional({ description: 'Reason for the refund' })
    @IsOptional()
    @IsString()
    refundReason?: string;

    @ApiPropertyOptional({ description: 'Additional notes about the refund' })
    @IsOptional()
    @IsString()
    refundNote?: string;
}