import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { UnitService } from 'src/unit-management/services/unit.service';
import { UnitModule } from 'src/unit-management/unit.module';
import { InventoryModule } from 'src/inventory-managemet/inventory.module';
import { ProductPermissionSeeder } from './seeders/product-permission.seeder';
@Module({
    imports: [
        TypeOrmModule.forFeature([Product]),
        forwardRef(() => UnitModule),
        forwardRef(() => InventoryModule)
    ],
    controllers: [ProductController],
    providers: [ProductService, ProductPermissionSeeder],
    exports: [ProductService, ProductPermissionSeeder],
})
export class ProductManagementModule { }
