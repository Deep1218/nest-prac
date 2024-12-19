import {
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
} from 'typeorm';

export enum TokenType {
  AUTH = 'auth',
  REFRESH = 'refresh',
}

@Entity({ name: 'tokens' })
export class TokensEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int8' })
  userId: number;

  @Column({ type: 'varchar' })
  token: string;

  @Column({ type: 'enum', enum: TokenType, default: TokenType.AUTH })
  type: TokenType;

  @Column({
    type: 'timestamp without time zone',
  })
  expireAt: Date;

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
