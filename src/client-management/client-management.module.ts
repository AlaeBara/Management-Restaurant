import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { ClientController } from './controllers/client.controller';
import { ClientService } from './services/client.service';
import { UserManagementModule } from 'src/user-management/user-management.module';
import { ClientPermissionSeeder } from './seeders/client-permission.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Client]),UserManagementModule],
  controllers: [ClientController],
  providers: [ClientService, ClientPermissionSeeder],
  exports: [ClientPermissionSeeder],
})
export class ClientManagementModule {}
