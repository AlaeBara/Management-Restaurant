import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  Entity,
  Index,
  ManyToOne,
  RelationId,
  AfterLoad,
  BeforeSoftRemove,
  AfterRecover,
} from 'typeorm';
import { SupplierStatus } from '../enums/status-supplier.enum';
import { MediaLibrary } from 'src/media-library-management/entities/media-library.entity';

@Entity(process.env.DATASET_PREFIX + 'suppliers')
@Index(['name'])
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  fax: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: SupplierStatus ,default: SupplierStatus.ACTIVE})
  status: SupplierStatus;

  @Column()
  rcNumber: string;

  @Column()
  iceNumber: string;

  @ManyToOne(() => MediaLibrary, (mediaLibrary) => mediaLibrary.id, { nullable: true , eager: true})
  logo: MediaLibrary;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeSoftRemove()
  async beforeSoftRemove() {
    console.log('entred');
    if (this.logo) {
      console.log('logo found');
      this.logo.deletedAt = new Date();
      console.log('logo deleted');
    }
  }

  @AfterRecover()
  async afterRecover() {
    if (this.logo) {
      this.logo.deletedAt = null;
    }
  }
}
