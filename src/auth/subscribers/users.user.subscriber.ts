import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  TransactionCommitEvent,
} from 'typeorm';
import { UsersEntity } from '../entities/users.user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UsersEntity> {
  private userDetails: UsersEntity;
  /**
   * Indicates that this subscriber only listen to Post events.
   */
  listenTo() {
    return UsersEntity;
  }

  /**
   * Called after entity insertion.
   */
  afterInsert(event: InsertEvent<any>) {
    console.log(`AFTER ENTITY INSERTED: `, event.entity);
    this.userDetails = event.entity;
  }

  /**
   * Called after transaction commit.
   */
  async afterTransactionCommit(event: TransactionCommitEvent) {
    console.log(`AFTER TRANSACTION COMMITTED: `);
  }
}
