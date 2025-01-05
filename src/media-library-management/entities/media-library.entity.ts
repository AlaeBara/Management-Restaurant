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
import { User } from 'src/user-management/entities/user.entity';

@Entity(`${process.env.DATASET_PREFIX || ''}media_library`)
@Index(['id', 'fileName', 'fileType', 'fileSize', 'uploadedBy'])
export class MediaLibrary extends BaseEntity {

    @Column({ type: 'varchar', nullable: true })
    fileName: string;

    @Column({ type: 'varchar', nullable: true })
    fileType: string;

    @Column({ type: 'varchar', nullable: true })
    fileExtension: string;

    @Column({ type: 'int', nullable: true })
    fileSize: number;

    @ManyToOne(() => User, (user) => user.id, { nullable: true })
    uploadedBy: User;

    @Column({ type: 'varchar', nullable: true })
    localPath: string;

    @Column({ type: 'boolean', default: false })
    isSynced: boolean = false; //Whether the file has been synced to the cloud.

    @Column({ type: 'varchar', nullable: true })
    cloudUrl: string;

    @Column({ type: 'int', default: 0 })
    syncAttempts: number = 0;

    @Column({ type: 'timestamp', nullable: true })
    lastSyncAttempt: Date;

}
