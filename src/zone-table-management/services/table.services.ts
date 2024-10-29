import { Injectable } from '@nestjs/common';
import { Table } from '../entities/table.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { GenericService } from 'src/common/services/generic.service';

@Injectable()
export class TableService  extends GenericService<Table>{
    constructor(
        @InjectDataSource() dataSource: DataSource,
        @InjectRepository(Table)
        private tableRepository: Repository<Table>,
    ) {
        super(dataSource, Table, 'table');
    }

}