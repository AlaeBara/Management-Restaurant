import { Type } from 'class-transformer';
import { 
  IsString, 
  IsNumber, 
  IsBoolean, 
  IsUUID, 
  IsUrl, 
  IsOptional, 
  ValidateNested, 
  ArrayMinSize,
  IsNotEmpty,
  Length,
  Min
} from 'class-validator';
import { CreateMenuItemTranslate } from '../menu-item-translate/create-menu-item-translation.dto';
import { CreateMenuItemPriceDto } from '../menu-item-price/create-menu-item-price.dto';
import { CreateMenuItemFormulaDto } from '../menu-item-formula/create-menu-item-formula.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuItemDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 15)
  @ApiProperty({
    description: 'The sku of the menu item',
    example: '1234567890'
  })
  menuItemSku: string;

  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'The quantity of the menu item',
    example: '10'
  })
  quantity: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'The warning quantity of the menu item',
    example: '10'
  })
  warningQuantity: number;

  @IsBoolean()
  @ApiProperty({
    description: 'The published status of the menu item',
    example: 'true'
  })
  isPublished: boolean;

  @IsBoolean()
  @ApiProperty({
    description: 'The draft status of the menu item',
    example: 'false'
  })
  isDraft: boolean;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The category id of the menu item',
    example: 'b3b2067b-e019-4fe3-ad69-c7468acb9db2'
  })
  categoryId: string;

  @IsOptional()
  @ApiProperty({
    description: 'The avatar of the menu item',
    example: 'https://example.com/avatar.jpg'
  })
  avatar?: string;

  @IsUUID(undefined, { each: true })
  @ArrayMinSize(1)
  @ApiProperty({
    description: 'The tag ids of the menu item',
    example: ['b3b2067b-e019-4fe3-ad69-c7468acb9db2', 'b3b2067b-e019-4fe3-ad69-c7468acb9db3']
  })
  tagIds: string[];

  @ValidateNested({ each: true })
  @Type(() => CreateMenuItemTranslate)
  @ArrayMinSize(1)
  @ApiProperty({
    description: 'The translations of the menu item',
    example: [{ languageId: 'b3b2067b-e019-4fe3-ad69-c7468acb9db2', name: 'English', description: 'English description' }]
  })
  translates: CreateMenuItemTranslate[];

  @ValidateNested()
  @Type(() => CreateMenuItemPriceDto)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The price of the menu item',
    example: { basePrice: 10, discountId: 'b3b2067b-e019-4fe3-ad69-c7468acb9db2' }
  })
  price: CreateMenuItemPriceDto;

  @ValidateNested()
  @Type(() => CreateMenuItemFormulaDto)
  @IsOptional()
  @ApiProperty({
    description: 'The formulas of the menu item',
    example: [{ productId: 'b3b2067b-e019-4fe3-ad69-c7468acb9db2', warningQuantity: 10, quantityFormula: 10, portionProduced: 10, unitId: 'b3b2067b-e019-4fe3-ad69-c7468acb9db2', quantityRequiredPerPortion: 10 }]
  })
  formulas: CreateMenuItemFormulaDto[];

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'The has formulas status of the menu item',
    example: 'true'
  })
  hasFormulas: boolean;
}