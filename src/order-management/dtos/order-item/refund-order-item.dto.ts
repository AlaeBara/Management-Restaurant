import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RefundOrderItemDto {
    @ApiProperty({ 
        description: 'The reason for the refund',
        maxLength: 255 
    })
    @IsString()
    refundReason: string;

    @ApiPropertyOptional({ 
        description: 'Additional notes about the refund',
        maxLength: 255 
    })
    @IsOptional()
    @IsString()
    refundNote?: string;
}