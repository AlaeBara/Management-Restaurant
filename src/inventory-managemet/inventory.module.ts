import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductManagementModule } from 'src/product-management/product.module';
import { StorageModule } from 'src/storage-management/storage.module';
import { Inventory } from './entities/inventory.entity';
import { InventoryController } from './controllers/inventory.controller';
import { InventoryService } from './services/inventory.service';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory]), ProductManagementModule, forwardRef(() => StorageModule)],
  controllers: [InventoryController],
  providers: [InventoryService, Inventory],
  exports: [InventoryService, Inventory],
})
export class InventoryModule { }
