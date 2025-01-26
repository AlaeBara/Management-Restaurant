import {
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryColumn,
    UpdateDateColumn
} from "typeorm";
import { ulid } from 'ulid';

export abstract class UlidBaseEntity {

    @PrimaryColumn('char', { length: 26 })
    id: string = ulid();

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamptz' })
    deletedAt: Date;

}   
