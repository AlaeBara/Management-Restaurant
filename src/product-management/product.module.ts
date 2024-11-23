import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { UnitService } from 'src/unit-management/services/unit.service';
import { UnitModule } from 'src/unit-management/unit.module';
@Module({
    imports: [TypeOrmModule.forFeature([Category, Product]), UnitModule],
    controllers: [CategoryController, ProductController],
    providers: [CategoryService, ProductService],
    exports: [ProductService],
})
export class ProductManagementModule { }
