import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { ClientController } from './controllers/client.controller';
import { ClientService } from './services/client.service';
import { UserManagementModule } from 'src/user-management/user-management.module';

@Module({
  imports: [TypeOrmModule.forFeature([Client]),UserManagementModule],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [],
})
export class ClientManagementModule {}
