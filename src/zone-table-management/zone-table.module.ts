import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Zone } from './entities/zone.entity';
import { Table } from './entities/table.entity';
import { ZoneController } from './controllers/zone.controller';
import { TableController } from './controllers/table.controller';
import { ZoneService } from './services/zone.services';
import { TableService } from './services/table.services';

@Module({
  imports: [TypeOrmModule.forFeature([Zone,Table])],
  controllers: [ZoneController,TableController],
  providers: [ZoneService,TableService],
  exports: [],
})
export class ZoneTableModule {}
