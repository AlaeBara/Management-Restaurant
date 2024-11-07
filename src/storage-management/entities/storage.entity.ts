import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";


@Entity()
export class Storage extends BaseEntity {
    @Column({type: 'varchar', length: 15})
    storageCode: string;

    @Column({type: 'varchar', length: 100})
    storageName: string;

    @ManyToOne(() => Storage, (storage) => storage.id, {nullable: true})
    subStorage: Storage;

    @RelationId((storage: Storage) => storage.subStorage)
    subStorageId: string;

    @Column({type: 'varchar', length: 100 , nullable: true})
    storagePlace: string;
}