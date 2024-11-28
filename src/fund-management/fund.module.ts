import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fund } from './entities/fund.entity';
import { FundController } from './controllers/fund.controller';
import { FundService } from './services/fund.service';
import { CommonModule } from 'src/common/common.module';

@Module({
    imports: [TypeOrmModule.forFeature([Fund])],
    controllers: [FundController],
    providers: [FundService],
    exports: [FundService],
})
export class FundModule { }
