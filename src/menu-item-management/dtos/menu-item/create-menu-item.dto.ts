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


export class CreateMenuItemFormulaDto {
  @IsNumber()
  @Min(0)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  unit: string;
}

export class CreateMenuItemDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 15)
  menuItemSku: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNumber()
  @Min(0)
  warningQuantity: number;

  @IsBoolean()
  isPublished: boolean;

  @IsBoolean()
  isDraft: boolean;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @IsUrl()
  @IsOptional()
  avatar?: string;

  @IsUUID(undefined, { each: true })
  @ArrayMinSize(1)
  tagIds: string[];

  /* @ValidateNested({ each: true })
  @Type(() => CreateMenuItemFormulaDto)
  @IsOptional()
  formulas?: CreateMenuItemFormulaDto[];

  @ValidateNested()
  @Type(() => CreateMenuItemPriceDto)
  @IsNotEmpty()
  price: CreateMenuItemPriceDto; */

  @ValidateNested({ each: true })
  @Type(() => CreateMenuItemTranslate)
  @ArrayMinSize(1)
  translates: CreateMenuItemTranslate[];

  @ValidateNested()
  @Type(() => CreateMenuItemPriceDto)
  @IsNotEmpty()
  price: CreateMenuItemPriceDto;
}