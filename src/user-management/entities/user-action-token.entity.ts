import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  RelationId,
} from 'typeorm';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TokenType } from '../enums/token.enum';
import { User } from './user.entity';

@Entity()
@Index(['token', 'id', 'user', 'type'])
export class UserActionToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @ManyToOne(() => User)
  user: User;

  @RelationId((userActionToken: UserActionToken) => userActionToken.user)
  userId: number;

  @Column()
  type: TokenType;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;
}
