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
import { InventoryMovementPermissionSeeder } from './seeders/inventory-movement-permissions.seeder';
import { InventoryPermissionSeeder } from './seeders/inventory-permission.seeder';
import { InventoryMovementListener } from './listeners/inventory-movement.listener';
import { OutboxModule } from 'src/outbox-module/outbox.module';
import { InventoryListenerFactory } from './listeners/inventory.listener.factory';
import { MenuItemModule } from 'src/menu-item-management/menu-item.module';
import { UnitModule } from 'src/unit-management/unit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory, InventoryMovement]),
    forwardRef(() => ProductManagementModule),
    forwardRef(() => StorageModule),
    forwardRef(() => UserManagementModule),
    forwardRef(() => OutboxModule),
    forwardRef(() => MenuItemModule),
    forwardRef(() => UnitModule)
  ],
  controllers: [
    InventoryController,
    InvetoryMovementController
  ],
  providers: [
    InventoryService,
    InventoryMovementService,
    Inventory,
    InventoryPermissionSeeder,
    InventoryMovementPermissionSeeder,
    InventoryMovementListener,
    InventoryListenerFactory
  ],
  exports: [
    InventoryService,
    InventoryMovementService,
    Inventory,
    InventoryPermissionSeeder,
    InventoryMovementPermissionSeeder,
    InventoryMovementListener,
    InventoryListenerFactory
  ],
})

export class InventoryModule { }
