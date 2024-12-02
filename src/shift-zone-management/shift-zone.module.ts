import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftZone } from './entities/shift-zone.entity';
import { UserManagementModule } from 'src/user-management/user-management.module';
import { ZoneTableModule } from 'src/zone-table-management/zone-table.module';
import { ShiftZoneService } from './services/shift-zone.service';
import { ShiftZoneController } from './controllers/shift-zone.controller';
import { ShiftReassignmentRequest } from './entities/shift-reassignment-request.entity';
import { ShiftZonePermissionSeeder } from './seeders/shift.permission';


@Module({
    imports: [TypeOrmModule.forFeature([ShiftZone, ShiftReassignmentRequest]), forwardRef(() => UserManagementModule), forwardRef(() => ZoneTableModule)],
    controllers: [ShiftZoneController],
    providers: [ShiftZoneService, ShiftZonePermissionSeeder],
    exports: [ShiftZonePermissionSeeder],
})
export class ShiftZoneModule { }
