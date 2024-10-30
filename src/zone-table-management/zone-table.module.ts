import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Zone } from './entities/zone.entity';
import { Table } from './entities/table.entity';
import { ZoneController } from './controllers/zone.controller';
import { TableController } from './controllers/table.controller';
import { ZoneService } from './services/zone.services';
import { TableService } from './services/table.services';
import { TablePermissionSeeder } from './seeders/table-permissions.dto';
import { ZonePermissionSeeder } from './seeders/zone-permissions.dto';
import { qrCodeModule } from 'src/qr-code/qr-code.module';

@Module({
  imports: [TypeOrmModule.forFeature([Zone,Table]), qrCodeModule],
  controllers: [ZoneController,TableController],
  providers: [ZoneService, TableService, TablePermissionSeeder, ZonePermissionSeeder],
  exports: [TablePermissionSeeder, ZonePermissionSeeder],
})
export class ZoneTableModule {}
