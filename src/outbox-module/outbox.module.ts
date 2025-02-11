import { forwardRef, Module } from '@nestjs/common';
import { OutboxService } from './services/outbox.service';
import { Outbox } from './entities/outbox.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutboxListener } from './listeners/outbox.listener';
import { InventoryModule } from 'src/inventory-managemet/inventory.module';
import { MenuItemModule } from 'src/menu-item-management/menu-item.module';
import { OutboxListenerFactory } from './listeners/outbox.listener.factory';
import { RetryFailedMenuItemCreatedActionCron } from './crons/retry-failed-menu-item-created-action.cron';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([Outbox]),
    ScheduleModule.forRoot(),
    forwardRef(() => InventoryModule),
    forwardRef(() => MenuItemModule)
  ],
  controllers: [],
  providers: [
    OutboxService,
    RetryFailedMenuItemCreatedActionCron,
    OutboxListener,
    OutboxListenerFactory,
  
  ],
  exports: [
    OutboxService,
    RetryFailedMenuItemCreatedActionCron,
    OutboxListener,
    OutboxListenerFactory,
  ],

})


export class OutboxModule { }
