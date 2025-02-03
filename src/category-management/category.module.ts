import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { CategoryPermissionSeeder } from './seeders/category-permission.seeder';
import { MenuItemModule } from 'src/menu-item-management/menu-item.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    forwardRef(() => MenuItemModule)
  ],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    CategoryPermissionSeeder
  ],
  exports: [
    CategoryService,
    CategoryPermissionSeeder
  ],
})

export class CategoryModule { }
