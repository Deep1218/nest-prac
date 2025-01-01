import { Exclude, Expose } from 'class-transformer';

export class UserEntity {
  firstName: string;
  lastName: string;

  @Exclude()
  password: string;

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
