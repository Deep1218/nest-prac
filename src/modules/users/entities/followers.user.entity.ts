import {
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
} from 'typeorm';

@Entity({ name: 'followers' })
export class FollowersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int8' })
  followingId: number;

  @Column({ type: 'int8' })
  followerId: number;

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
