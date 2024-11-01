import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { SupplierController } from './controllers/supplier.controller';
import { SupplierService } from './services/supplier.service';
import { SupplierPermissionsSeeder } from './seeders/supplier-permissions.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier])],
  controllers: [SupplierController],
  providers: [SupplierService, SupplierPermissionsSeeder],
  exports: [SupplierPermissionsSeeder],
})
export class SupplierModule {}
