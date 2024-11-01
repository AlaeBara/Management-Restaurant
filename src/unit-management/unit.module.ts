import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unit } from './entities/unit.entity';
import { UnitService } from './services/unit.service';
import { UnitController } from './controllers/unit.controller';
import { UnitPermissionsSeeder } from './seeders/unit-permissions.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Unit])],
  controllers: [UnitController],
  providers: [UnitService, UnitPermissionsSeeder],
  exports: [UnitPermissionsSeeder],
})
export class UnitModule {}
