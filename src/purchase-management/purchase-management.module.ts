import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierModule } from 'src/supplier-management/supplier.module';
import { Purchase } from './entities/purchase.entity';
import { PurchaseItem } from './entities/purchase-item.entity';
import { PurchaseStatusHistory } from './entities/purchase-status-history';


@Module({
  imports: [TypeOrmModule.forFeature([Purchase,PurchaseItem,PurchaseStatusHistory]), forwardRef(() => SupplierModule)],
  controllers: [],
  providers: [],
  exports: [],
})
export class PurchaseManagementModule { }
