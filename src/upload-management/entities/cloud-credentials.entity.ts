import { Role } from 'src/user-management/entities/role.entity';
import { Gender } from 'src/common/enums/gender.enum';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    RelationId,
    UpdateDateColumn,
} from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { CloudServices } from '../enums/cloud-services.enum';
import { User } from 'src/user-management/entities/user.entity';

@Entity(`${process.env.DATASET_PREFIX || ''}cloud_credentials`)
export class CloudCredentials extends BaseEntity {
    @Column({ type: 'enum', enum: CloudServices })
    service: CloudServices;

    // AWS
    @Column({ type: 'varchar', nullable: true })
    AWS_ACCESS_KEY_ID: string;

    @Column({ type: 'text', nullable: true })
    AWS_SECRET_ACCESS_KEY: string;

    @Column({ type: 'varchar', nullable: true })
    AWS_REGION: string;

    @Column({ type: 'varchar', nullable: true })
    AWS_BUCKET_NAME: string;

    // CLOUDINARY
    @Column({ type: 'varchar', nullable: true })
    CLOUDINARY_CLOUD_NAME: string;

    @Column({ type: 'varchar', nullable: true })
    CLOUDINARY_API_KEY: string;

    @Column({ type: 'varchar', nullable: true })
    CLOUDINARY_API_SECRET: string;

    @Column({ type: 'boolean', default: false })
    default: boolean = false;

    @ManyToOne(() => User, (user) => user.id)
    userOwner: User; // only this user can see the decrypted credentials else it will be encrypted

    @RelationId((cloudCredentials: CloudCredentials) => cloudCredentials.userOwner)
    userOwnerId: string;
}
