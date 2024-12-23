import { Exclude, Expose } from 'class-transformer';
import { CompaniesEntity } from '../../modules/users/entities/companies.user.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
  OneToOne,
  JoinColumn,
} from 'typeorm';

export enum UserRole {
  MASTER = 'master',
  ADMIN = 'admin',
  VIEWER = 'viewer',
  EDITOR = 'editor',
  USER = 'user',
}
export enum UserStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  BLOCKED = 2,
}

@Entity({ name: 'users' })
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  firstName: string;

  @Column({ type: 'varchar', length: 50 })
  lastName: string;

  @Column({ type: 'varchar', length: 250, unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 250 })
  password: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  profilePicUrl: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

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

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @OneToOne(() => CompaniesEntity)
  @JoinColumn()
  company: CompaniesEntity;
}
