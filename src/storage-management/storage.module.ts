import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Storage } from './entities/storage.entity';
import { StorageService } from './services/storage.service';
import { StorageController } from './controllers/storage.controller';
import { CommonModule } from 'src/common/common.module';
import { StoragePermissionSeeder } from './seeders/storage-permissions.dto';

@Module({
    imports: [TypeOrmModule.forFeature([Storage])],
    controllers: [StorageController],
    providers: [StorageService, StoragePermissionSeeder],
    exports: [StorageService, StoragePermissionSeeder],
})
export class StorageModule { }
