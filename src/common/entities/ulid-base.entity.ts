import {
    BeforeInsert,
    BeforeSoftRemove,
    BeforeUpdate,
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryColumn,
    UpdateDateColumn
} from "typeorm";
import { ulid } from 'ulid';

export abstract class UlidBaseEntity {

    @PrimaryColumn('char', { length: 26 })
    id: string = ulid();

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @BeforeInsert()
    adjustToLocalTime() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    @BeforeUpdate()
    adjustToUpdateTime() {
        this.updatedAt = new Date();
    }

    @BeforeSoftRemove()
    adjustToDeleteTime() {
        this.deletedAt = new Date();
    }

}   
