import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductManagementModule } from 'src/product-management/product.module';
import { StorageModule } from 'src/storage-management/storage.module';
import { Inventory } from './entities/inventory.entity';
import { InventoryController } from './controllers/inventory.controller';
import { InventoryService } from './services/inventory.service';
import { InventoryMovement } from './entities/inventory-movement.entity';
import { UserManagementModule } from 'src/user-management/user-management.module';
import { InvetoryMovementController } from './controllers/inventory-movement.controller';
import { InventoryMovementService } from './services/inventory-movement.service';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, InventoryMovement]), ProductManagementModule, forwardRef(() => StorageModule), forwardRef(() => UserManagementModule)],
  controllers: [InventoryController, InvetoryMovementController],
  providers: [InventoryService, InventoryMovementService, Inventory],
  exports: [InventoryService, InventoryMovementService, Inventory],
})
export class InventoryModule { }
