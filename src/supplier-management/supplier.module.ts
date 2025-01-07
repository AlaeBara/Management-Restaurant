import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { SupplierController } from './controllers/supplier.controller';
import { SupplierService } from './services/supplier.service';
import { SupplierPermissionsSeeder } from './seeders/supplier-permissions.seeder';
import { MediaLibraryModule } from 'src/media-library-management/media-library.module';
import { PurchaseManagementModule } from 'src/purchase-management/purchase-management.module';
import { PurchaseService } from 'src/purchase-management/services/purchase.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Supplier]),
    forwardRef(() => MediaLibraryModule),
    forwardRef(() => PurchaseManagementModule)
  ],
  controllers: [SupplierController],
  providers: [SupplierService, SupplierPermissionsSeeder],
  exports: [SupplierService, SupplierPermissionsSeeder],
})
export class SupplierModule { }


