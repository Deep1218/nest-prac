import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { mainDBSourceOptions, userDBSourceOptions } from './data.source';
import { normalize, resolve } from 'path';
import { UserSeeder } from '../../auth/entities/users.user.seeder';
// User database
const userDBOptions: DataSourceOptions & SeederOptions = {
  ...userDBSourceOptions,
  // seeds: [
  //   normalize(
  //     resolve(__dirname, '..', '..', '**', '*', '*.user.seeder{.ts,.js}'),
  //   ),
  // ],
  seeds: [UserSeeder],
};
const userDataSource = new DataSource(userDBOptions);

// Main database
const mainDBOptions: DataSourceOptions & SeederOptions = {
  ...mainDBSourceOptions,
  seeds: [
    normalize(
      resolve(__dirname, '..', '..', '**', '*', '*.main.seeder{.ts,.js}'),
    ),
  ],
};
const mainDataSource = new DataSource(mainDBOptions);

async function main() {
  const userDBResult = await userDataSource.initialize().then(async () => {
    return runSeeders(userDataSource);
  });
  const mainDBResult = await mainDataSource.initialize().then(async () => {
    return runSeeders(mainDataSource);
  });
  console.log({ userDBResult, mainDBResult });
}
main().then(() => process.exit(1));
