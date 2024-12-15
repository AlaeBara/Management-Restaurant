import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierModule } from 'src/supplier-management/supplier.module';
import { Purchase } from './entities/purchase.entity';
import { PurchaseItem } from './entities/purchase-item.entity';
import { PurchaseService } from './services/purchase.service';
import { PurchaseController } from './controllers/purchase.controller';
import { FundModule } from 'src/fund-management/fund.module';
import { UserManagementModule } from 'src/user-management/user-management.module';
import { ProductManagementModule } from 'src/product-management/product.module';
import { InventoryModule } from 'src/inventory-managemet/inventory.module';
import { PurchaseItemService } from './services/purchase-item.service';
import { PurchasePermissionSeeder } from './seeders/purchase.seeder';
import { PurchasePaiement } from './entities/purchase-paiement.entity';
import { PurchasePaiementService } from './services/purchase-paiement.service';


@Module({
  imports: [TypeOrmModule.forFeature([Purchase, PurchaseItem, PurchasePaiement]),
  forwardRef(() => SupplierModule),
  forwardRef(() => FundModule),
  forwardRef(() => UserManagementModule),
  forwardRef(() => ProductManagementModule),
  forwardRef(() => InventoryModule)],
  controllers: [PurchaseController],
  providers: [PurchaseService, PurchaseItemService, PurchasePaiementService, PurchasePermissionSeeder],
  exports: [PurchaseService, PurchaseItemService, PurchasePaiementService, PurchasePermissionSeeder],
})
export class PurchaseManagementModule { }

