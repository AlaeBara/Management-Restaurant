import { BaseEntity } from "src/common/entities/base.entity";
import { AfterLoad, Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId, Tree, TreeParent } from "typeorm";
import { getManager } from "typeorm";
@Entity(process.env.DATASET_PREFIX + 'storages')
@Tree("materialized-path")
export class Storage extends BaseEntity {
    @Column({ type: 'varchar', length: 15 })
    storageCode: string;

    @Column({ type: 'varchar', length: 100 })
    storageName: string;

    @TreeParent()
    parentStorage: Storage;

    @RelationId((storage: Storage) => storage.parentStorage)
    parentStorageId: string;

    hierarchyPath: string;
}