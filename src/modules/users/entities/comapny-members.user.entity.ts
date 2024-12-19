import {
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
} from 'typeorm';

@Entity({ name: 'company_members' })
export class CompanyMembersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int8' })
  userId: number;

  @Column({ type: 'int8' })
  companyId: number;

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
