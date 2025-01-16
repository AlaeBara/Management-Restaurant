import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  DeleteDateColumn,
  Index,
  RelationId,
  ManyToOne,
} from 'typeorm';
import { Role } from './role.entity';
import { Gender } from '../../common/enums/gender.enum';
import { UserStatus } from '../enums/user-status.enum';
import { MediaLibrary } from 'src/media-library-management/entities/media-library.entity';

@Index(['id','username','phone','email','status'])
@Entity(process.env.DATASET_PREFIX + 'users')
export class User  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  gender: Gender;

  @Column()
  username: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: UserStatus.EMAIL_UNVERIFIED })
  status: UserStatus;

  @Column()
  email: string;

  @Column({select: false})
  password: string;

  @ManyToOne(() => MediaLibrary, (mediaLibrary) => mediaLibrary.id, { nullable: true , eager: true})
  avatar: MediaLibrary;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  emailVerifiedAt: Date;

  @Column({ default: false })
  isBlocked: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({select: false})
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToMany(() => Role)
  @JoinTable({ name: process.env.DATASET_PREFIX + 'user_roles' })
  roles: Role[];

  @RelationId((user: User) => user.roles)
  roleIds: number[];
}
