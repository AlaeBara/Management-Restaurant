import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Fund } from './entities/fund.entity';
import { FundController } from './controllers/fund.controller';
import { FundService } from './services/fund.service';
import { FundOperationEntity } from './entities/fund-operation.entity';
import { FundOperationService } from './services/fund-operation.service';
import { FundOperationController } from './controllers/fund-operation.controller';
import { UserManagementModule } from 'src/user-management/user-management.module';
import { ExpenseType } from './entities/expense-type.entity';
import { ExpenseTypeService } from './services/expense-type.service';
import { ExpenseTypeController } from './controllers/expense-type.controller';
import { FundPermissionSeeder } from './seeders/fund.seeder';

@Module({
    imports: [TypeOrmModule.forFeature([Fund, FundOperationEntity, ExpenseType]), forwardRef(() => UserManagementModule)],
    controllers: [
        FundController,
        FundOperationController,
        ExpenseTypeController
    ],
    providers: [
        FundService,
        FundOperationService,
        ExpenseTypeService,
        FundPermissionSeeder
    ],
    exports: [
        FundService,
        FundOperationService,
        ExpenseTypeService,
        FundPermissionSeeder
    ],
})

export class FundModule { }
