import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserRole, UsersEntity } from './users.user.entity';

export class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const userRepository = dataSource.getRepository(UsersEntity);
    let superAdmin = await userRepository.findOne({
      where: {
        email: 'test.superadmin@mailinator.com',
        role: UserRole.SUPER_ADMIN,
      },
    });
    if (!superAdmin) {
      superAdmin = await userRepository.save({
        firstName: 'Super',
        lastName: 'Admin',
        email: 'test.superadmin@mailinator.com',
        password: 'test123',
        role: UserRole.SUPER_ADMIN,
      });
    }
    return superAdmin;
  }
}
