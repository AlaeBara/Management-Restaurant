import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fund } from './entities/fund.entity';
import { FundController } from './controllers/fund.controller';
import { FundService } from './services/fund.service';
import { CommonModule } from 'src/common/common.module';
import { FundOperationEntity } from './entities/fund-operation.entity';
import { FundOperationService } from './services/fund-operation.service';
import { FundOperationController } from './controllers/fund-operation.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Fund, FundOperationEntity])],
    controllers: [FundController, FundOperationController],
    providers: [FundService, FundOperationService],
    exports: [FundService, FundOperationService],
})
export class FundModule { }
