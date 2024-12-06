import { Global, Module } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { MasterSeeder } from './seeders/master.seeder';
import { UserManagementModule } from 'src/user-management/user-management.module';
import { ZoneTableModule } from 'src/zone-table-management/zone-table.module';
import { ClientManagementModule } from 'src/client-management/client-management.module';
import { UnitModule } from 'src/unit-management/unit.module';
import { SupplierModule } from 'src/supplier-management/supplier.module';
import { StorageModule } from 'src/storage-management/storage.module';
import { InventoryModule } from 'src/inventory-managemet/inventory.module';
import { ProductManagementModule } from 'src/product-management/product.module';
import { ShiftZoneModule } from 'src/shift-zone-management/shift-zone.module';
import { FundModule } from 'src/fund-management/fund.module';

@Global()
@Module({
  imports: [UserManagementModule, ZoneTableModule, ClientManagementModule,
    UnitModule, SupplierModule, StorageModule, InventoryModule, ProductManagementModule, ShiftZoneModule, FundModule],
  controllers: [],
  providers: [MailService, MasterSeeder],
  exports: [MailService],
})
export class CommonModule { }
