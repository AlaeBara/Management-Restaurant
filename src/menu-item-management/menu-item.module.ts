import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryItemModule } from 'src/category-item-management/category-item.module';
import { LanguageModule } from 'src/language-management/language.module';
import { ProductManagementModule } from 'src/product-management/product.module';
import { MenuItemTag } from './entities/menu-item-tag.entity';
import { MenuItemTagController } from './controllers/menu-item-tag.controller';
import { MenuItemTagService } from './services/menu-item-tag.service';
import { MenuItem } from './entities/menu-item.entity';
import { MenuItemService } from './services/menu-item.service';
import { MenuItemController } from './controllers/menu-item.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItemTag, MenuItem]), forwardRef(() => LanguageModule), forwardRef(() => CategoryItemModule)],
  controllers: [MenuItemTagController, MenuItemController],
  providers: [MenuItemTagService, MenuItemService ],
  exports: [],
})
export class MenuItemModule { }
