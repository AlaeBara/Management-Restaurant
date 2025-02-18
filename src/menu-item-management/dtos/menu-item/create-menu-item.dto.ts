import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsNumber, 
  IsBoolean, 
  IsUUID,
  IsOptional, 
  ValidateNested, 
  ArrayMinSize,
  IsNotEmpty,
  Length,
  Min,
  IsArray,
  IsEnum
} from 'class-validator';

import { CreateMenuItemTranslate } from '../menu-item-translate/create-menu-item-translation.dto';
import { DiscountMethod } from 'src/menu-item-management/enums/discount-method.enum';
import { CreateMenuItemIngredientRecipeDto } from '../menu-item-recipe/create-menu-item-ingredient-recipe.dto';
import { DiscountLevel } from 'src/menu-item-management/enums/discount-level.enum';
import { AddChoiceToMenuItemDto } from '../menu-item-choices/add-choice-to-menu-item.dto';
import { AssignChoicesWithMenuItemDto } from '../menu-item-choices/assign-choices-with-menu-item.dto';

export class CreateMenuItemDto {

  @IsString()
  @IsNotEmpty()
  @Length(3, 15)
  @ApiProperty({
    description: 'The sku of the menu item',
    example: '1234567890'
  })
  menuItemSku: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  @ApiProperty({
    description: 'The name of the menu item',
    example: 'Pizza'
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  @ApiProperty({
    description: 'The description of the menu item',
    example: 'Pizza description'
  })
  description: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))

  @ApiProperty({
    description: 'The quantity of the menu item',
    example: '10'
  })
  quantity: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => Number(value))
  @ApiProperty({
    description: 'The warning quantity of the menu item',
    example: '10'
  })
  warningQuantity: number;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @ApiProperty({
    description: 'The published status of the menu item',
    example: 'true'
  })
  isPublished: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @ApiProperty({
    description: 'The draft status of the menu item',
    example: 'false'
  })
  isDraft: boolean;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'The category id of the menu item',
    example: 'b3b2067b-e019-4fe3-ad69-c7468acb9db2'
  })
  categoryId: string;

  @IsUUID(undefined, { each: true })
  @ArrayMinSize(1)
  @ApiProperty({
    description: 'The tag ids of the menu item',
    example: ['b3b2067b-e019-4fe3-ad69-c7468acb9db2', 'b3b2067b-e019-4fe3-ad69-c7468acb9db3']
  })
  tagIds: string[];

  @ValidateNested({ each: true })
  @Type(() => CreateMenuItemTranslate)
  @ApiProperty({
    description: 'The translations of the menu item',
    example: [{ languageId: 'b3b2067b-e019-4fe3-ad69-c7468acb9db2', name: 'English', description: 'English description' }]
  })
  translates: CreateMenuItemTranslate[];

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @ApiProperty({
    description: 'The portion produced of the menu item',
    example: '10'
  })
  portionProduced: number;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @ApiProperty({
    description: 'The has recipe status of the menu item',
    example: 'true'
  })
  hasRecipe: boolean;

  @ValidateNested()
  @Type(() => CreateMenuItemIngredientRecipeDto)
  @IsOptional()
  @ApiProperty({
    description: 'The recipes of the menu item',
    example: [{ productId: 'b3b2067b-e019-4fe3-ad69-c7468acb9db2', inventoryId: 'b3b2067b-e019-4fe3-ad69-c7468acb9db2', ingredientQuantity: 10, unitId: 'b3b2067b-e019-4fe3-ad69-c7468acb9db2' }]
  })
  recipe: CreateMenuItemIngredientRecipeDto[];

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({
      description: 'The price of the menu item',
      example: '99.99'
  })
  basePrice: number;

  @IsEnum(DiscountLevel)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The discount level of the menu item',
    example: 'advanced'
  })
  discountLevel: DiscountLevel;

  @IsOptional()
  @IsUUID()
  @IsString()
  @ApiProperty({
      description: 'The discount id of the menu item',
      example: 'b3b2067b-e019-4fe3-ad69-c7468acb9db2'
  })
  discountId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The discount method of the menu item',
    example: 'PERCENTAGE',
    required: false,
  })
  discountMethod: DiscountMethod;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({
    description: 'The discount value of the menu item',
    example: '99.99',
    required: false,
  })
  discountValue: number;

  @ValidateNested()
  @IsOptional()
  @IsArray()
  images?: Express.Multer.File[];

  @IsArray()
  @IsOptional()
  /* @ValidateNested({ each: true })
  @Type(() => AssignChoicesWithMenuItemDto) */
  @ApiProperty({
    description: 'The choices of the menu item',
    example: [{ choiceId: 'b3b2067b-e019-4fe3-ad69-c7468acb9db2', additionalPrice: 10 }]
  })
  choices: AssignChoicesWithMenuItemDto[];
}
