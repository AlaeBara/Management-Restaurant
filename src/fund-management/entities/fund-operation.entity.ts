import { BeforeInsert, Column, Entity, ManyToOne, JoinColumn, RelationId, AfterLoad } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { FundOperation, FundOperationStatus, getOperationAction } from '../enums/fund-operation.enum';
import { Fund } from './fund.entity';

@Entity(process.env.DATASET_PREFIX + 'fund_operations')
export class FundOperationEntity extends BaseEntity {

    @Column()
    operation: FundOperation;

    @Column()
    action: 'increase' | 'decrease';

    @Column({ default: 0, type: "decimal", precision: 10, scale: 2 })
    amount: number;

    @Column({ nullable: true })
    note: string;

    @Column({ nullable: true })
    reference: string;

    @Column({ type: 'timestamp' })
    dateOperation: Date;

    @ManyToOne(() => Fund, { eager: true })
    @JoinColumn({ name: 'fund_id' })
    fund: Fund;

    @RelationId((operation: FundOperationEntity) => operation.fund)
    fundId: string;

    @Column({ default: FundOperationStatus.PENDING })
    status: FundOperationStatus;

    @BeforeInsert()
    setAction() {
        this.action = getOperationAction(this.operation);
    }
}
