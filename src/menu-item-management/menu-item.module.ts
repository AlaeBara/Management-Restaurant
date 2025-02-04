import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryModule } from 'src/category-management/category.module';
import { LanguageModule } from 'src/language-management/language.module';
import { ProductManagementModule } from 'src/product-management/product.module';
import { MenuItemTag } from './entities/menu-item-tag.entity';
import { MenuItemTagController } from './controllers/menu-item-tag.controller';
import { MenuItemTagService } from './services/menu-item-tag.service';
import { MenuItem } from './entities/menu-item.entity';
import { MenuItemService } from './services/menu-item.service';
import { MenuItemController } from './controllers/menu-item.controller';
import { UnitModule } from 'src/unit-management/unit.module';
import { MenuItemDiscount } from './entities/menu-item-discount.entity';
import { MenuItemTranslate } from './entities/menu-item-translation.enity';
import { InventoryModule } from 'src/inventory-managemet/inventory.module';
import { MenuItemDiscountService } from './services/menu-item-discount.service';
import { MenuItemDiscountController } from './controllers/menu-item-discount.controller';
import { MenuItemTranslationService } from './services/menu-item-translation.service';
import { MediaLibraryModule } from 'src/media-library-management/media-library.module';
import { TagSeeder } from './seeders/tag.seeder';
import { MenuItemRecipe } from './entities/menu-item-recipe.entity';
import { MenuItemRecipeService } from './services/menu-item-recipe.service';
import { MenuItemPublicController } from './controllers/public/menu-item.public.controller';
import { MenuItemPublicService } from './services/public/menu-item.public.service';
import { MenuItemChoices } from './entities/choices/menu-item-choices.entity';
import { ChoiceAttribute } from './entities/choices/choice-attribute.entity';
import { Choice } from './entities/choices/choice.entity';
import { ChoiceAttributeService } from './services/choice/choice-attribute.service';
import { ChoiceAttributeController } from './controllers/choice-attribute.controller';
import { ChoiceController } from './controllers/choice.controller';
import { ChoiceService } from './services/choice/choice.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        MenuItemTag,
        MenuItem,
        MenuItemRecipe,
        MenuItemDiscount,
        MenuItemTranslate,
        MenuItemChoices,
        ChoiceAttribute,
        Choice
      ]),
    forwardRef(() => LanguageModule),
    forwardRef(() => CategoryModule),
    forwardRef(() => ProductManagementModule),
    forwardRef(() => UnitModule),
    forwardRef(() => InventoryModule),
    forwardRef(() => MediaLibraryModule)],
  controllers: [
    MenuItemTagController,
    MenuItemController,
    MenuItemDiscountController,
    MenuItemPublicController,
    ChoiceAttributeController,
    ChoiceController
  ],
  providers: [
    MenuItemTagService,
    MenuItemService,
    MenuItemDiscountService,
    MenuItemTranslationService,
    MenuItemRecipeService,
    TagSeeder,
    MenuItemPublicService,
    ChoiceAttributeService,
    ChoiceService
  ],
  exports: [
    TagSeeder,
    MenuItemService
  ],
})
export class MenuItemModule { }
