import { Global, Module } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { MasterSeeder } from './seeders/master.seeder';
import { UserManagementModule } from 'src/user-management/user-management.module';
import { ZoneTableModule } from 'src/zone-table-management/zone-table.module';

@Global()
@Module({
  imports: [UserManagementModule, ZoneTableModule],
  controllers: [],
  providers: [MailService, MasterSeeder],
  exports: [MailService],
})
export class CommonModule {}
