import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { FundType } from '../enums/fund-type.enum';

@Entity(process.env.DATASET_PREFIX + 'funds')
export class Fund extends BaseEntity {
    @Column()
    sku:string

    @Column()
    name: string;

    @Column({ type: "enum", enum: FundType })
    type: FundType;
    
    @Column({default:0,type:"decimal",precision:10,scale:2})
    currentBalance: number;

    @Column({default:true})
    isActive: boolean;

    @Column({nullable:true})
    description: string;
}
