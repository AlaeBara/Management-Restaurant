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
import { MenuItemFormula } from './entities/menu-item-formula.entity';
import { MenuItemPrice } from './entities/menu-item-price.entityt';
import { MenuItemPriceHistory } from './entities/menu-item-price-history.entity';
import { MenuItemDiscount } from './entities/menu-item-discount.entity';
import { MenuItemTranslate } from './entities/menu-item-translation.enity';
import { InventoryModule } from 'src/inventory-managemet/inventory.module';
import { MenuItemAllocationMovement } from './entities/menu-item-allocation.entity';
import { MenuItemDiscountService } from './services/menu-item-discount.service';
import { MenuItemDiscountController } from './controllers/menu-item-discount.controller';
import { MenuItemTranslationService } from './services/menu-item-translation.service';
import { MenuItemPriceService } from './services/menu-item-price.service';
import { MenuItemPriceHistoryService } from './services/menu-item-price-history.service';
import { MenuItemFormulaService } from './services/menu-item-formulas.service';
import { MediaLibraryModule } from 'src/media-library-management/media-library.module';
import { TagSeeder } from './seeders/tag.seeder';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        MenuItemTag,
        MenuItem,
        MenuItemFormula,
        MenuItemPrice,
        MenuItemPriceHistory,
        MenuItemDiscount,
        MenuItemTranslate,
        MenuItemAllocationMovement
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
    MenuItemDiscountController
  ],
  providers: [
    MenuItemTagService,
    MenuItemService,
    MenuItemDiscountService,
    MenuItemTranslationService,
    MenuItemPriceService,
    MenuItemPriceHistoryService,
    MenuItemFormulaService,
    TagSeeder
  ],
  exports: [
    TagSeeder
  ],
})
export class MenuItemModule { }
