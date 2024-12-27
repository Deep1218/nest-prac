import { UsersEntity } from '../../../auth/entities/users.user.entity';
import { CompaniesEntity } from '../../users/entities/companies.user.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
  ManyToMany,
  JoinColumn,
} from 'typeorm';

export enum PostStatus {
  UNDER_REVIEW = 0,
  PUBLISHED = 1,
  REJECTED = 2,
}

@Entity({ name: 'posts' })
export class PostsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 250 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  mediaUrl: string;

  @Column({ type: 'enum', enum: PostStatus, default: PostStatus.UNDER_REVIEW })
  status: PostStatus;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

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
}
