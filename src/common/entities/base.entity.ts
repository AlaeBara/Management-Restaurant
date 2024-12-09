import { BeforeInsert, BeforeSoftRemove, BeforeUpdate, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

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
