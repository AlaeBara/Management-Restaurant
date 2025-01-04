import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { CategoryPermissionSeeder } from './seeders/category-permission.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryPermissionSeeder],
  exports: [CategoryService, CategoryPermissionSeeder],
})
export class CategoryModule { }
