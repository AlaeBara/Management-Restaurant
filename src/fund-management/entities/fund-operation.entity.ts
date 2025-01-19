import { BeforeInsert, Column, Entity, ManyToOne, JoinColumn, RelationId, AfterLoad } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { FundOperation, FundOperationStatus, getOperationAction } from '../enums/fund-operation.enum';
import { Fund } from './fund.entity';
import { User } from 'src/user-management/entities/user.entity';
import { ExpenseType } from './expense-type.entity';

@Entity(process.env.DATASET_PREFIX + 'fund_operations')
export class FundOperationEntity extends BaseEntity {

    @Column()
    operationType: FundOperation;

    @Column()
    operationAction: string;

    @ManyToOne(() => ExpenseType, { eager: true , nullable: true })
    @JoinColumn()
    expenseType: ExpenseType;

    @Column({ default: 0, type: "decimal", precision: 10, scale: 2 })
    amount: number;

    @Column({ nullable: true })
    note: string;

    @Column({ nullable: true })
    reference: string;

    @Column({ type: 'timestamp' })
    dateOperation: Date;

    @Column({ type: 'timestamp', nullable: true })
    approvedAt: Date;

    @ManyToOne(() => Fund, { eager: true })
    @JoinColumn()
    fund: Fund;

    @RelationId((operation: FundOperationEntity) => operation.fund)
    fundId: string;

    @ManyToOne(() => Fund, { eager: true, nullable: true })
    @JoinColumn()
    transferToFund: Fund;

    @RelationId((operation: FundOperationEntity) => operation.transferToFund)
    transferToFundId: string;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'createdBy' })
    createdBy: User;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'approvedBy' })
    approvedBy: User;

    @Column({ default: FundOperationStatus.PENDING })
    status: FundOperationStatus;

    @BeforeInsert()
    setAction() {
        this.operationAction = this.operationAction || getOperationAction(this.operationType);
    }

    @BeforeInsert()
    setApprovedAt() {
        if (this.status == FundOperationStatus.APPROVED) this.approvedAt = new Date();
    }
}
