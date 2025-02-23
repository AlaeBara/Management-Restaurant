import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Zone } from './entities/zone.entity';
import { Table } from './entities/table.entity';
import { ZoneController } from './controllers/zone.controller';
import { TableController } from './controllers/table.controller';
import { ZoneService } from './services/zone.service';
import { TableService } from './services/table.service';
import { TablePermissionSeeder } from './seeders/table-permissions.dto';
import { ZonePermissionSeeder } from './seeders/zone-permissions.dto';
import { qrCodeModule } from 'src/qr-code/qr-code.module';
import { User } from 'src/user-management/entities/user.entity';
import { UserManagementModule } from 'src/user-management/user-management.module';
import { RedirectController } from './controllers/redirect.controller';
import { RedirectService } from './services/redirect.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Zone, Table]),
    forwardRef(() => qrCodeModule),
    forwardRef(() => UserManagementModule),
  ],
  controllers: [
    ZoneController,
    TableController,
    RedirectController
  ],
  providers: [
    ZoneService,
    TableService,
    TablePermissionSeeder,
    ZonePermissionSeeder,
    RedirectService
  ],
  exports: [
    TablePermissionSeeder,
    ZonePermissionSeeder,
    ZoneService,
    TableService,
  ],
})
export class ZoneTableModule { }
