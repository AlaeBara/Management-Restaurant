import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Storage } from './entities/storage.entity';
import { StorageService } from './services/storage.service';
import { StorageController } from './controllers/storage.controller';
import { CommonModule } from 'src/common/common.module';
import { StoragePermissionSeeder } from './seeders/storage-permissions.dto';
import { InventoryModule } from 'src/inventory-managemet/inventory.module';
import { Inventory } from 'src/inventory-managemet/entities/inventory.entity';


@Module({
    imports: [TypeOrmModule.forFeature([Storage,Inventory]), forwardRef(() => InventoryModule)],
    controllers: [StorageController],
    providers: [StorageService, StoragePermissionSeeder],
    exports: [StorageService, StoragePermissionSeeder],
})
export class StorageModule { }
