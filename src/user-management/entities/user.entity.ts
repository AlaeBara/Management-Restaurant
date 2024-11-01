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
} from 'typeorm';
import { Role } from './role.entity';
import { Gender } from '../../common/enums/gender.enum';
import { UserStatus } from '../enums/user-status.enum';

@Index(['id','username','phone','email','status'])
@Entity()
export class User  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  gender: Gender;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: UserStatus.EMAIL_UNVERIFIED })
  status: UserStatus;

  @Column({ unique: true })
  email: string;

  @Column({select: false})
  password: string;

  @Column({ nullable: true })
  avatar: string;

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
  @JoinTable()
  roles: Role[];

  @RelationId((user: User) => user.roles)
  roleIds: number[];
}
