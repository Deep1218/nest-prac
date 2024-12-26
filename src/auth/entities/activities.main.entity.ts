import { CompaniesEntity } from '../../modules/users/entities/companies.user.entity';
import { UsersEntity } from './users.user.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum LogTypes {
  MEMBER_ADDED = 'new memeber add',
  MEMBER_LOGEDIN = 'memeber loged in',
  MEMBER_POSTED = 'memeber created a new post',
}

@Entity({ name: 'activities' })
export class ActivitiesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: LogTypes, nullable: false })
  type: LogTypes;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ type: 'int4', nullable: false })
  companyId: number;

  @Column({ type: 'int4', nullable: false })
  userId: number;
}
