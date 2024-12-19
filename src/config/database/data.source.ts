import { DataSource, DataSourceOptions } from 'typeorm';
import { resolve, normalize } from 'path';
import * as dotenv from 'dotenv';

dotenv.config({
  path: resolve('.', 'environments', `.env.${process.env.NODE_ENV}`),
});

// TypeORM configuration options for user database
const userDBSourceOptions: DataSourceOptions = {
  name: 'userDB', // Name of this DataSource. only if have more than one DB connection
  type: 'postgres',
  url: process.env.DATABASE_URL_USER,
  entities: [
    normalize(
      resolve(__dirname, '..', '..', '**', '*', '*.user.entity{.ts,.js}'),
    ),
  ], // Adjust based on your output path
  migrations: [
    normalize(
      resolve(
        __dirname,
        '..',
        '..',
        'scripts',
        'migrations',
        'userDB',
        '*{.ts,.js}',
      ),
    ),
    ,
  ], // Adjust based on your migrations path
  synchronize: false, // Use migrations instead of synchronize in production
  logging: false,
};

// TypeORM configuration options for main database
const mainDBSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    normalize(resolve(__dirname, '..', '..', '**', '*', '*.entity{.ts,.js}')),
  ], // Adjust based on your output path
  migrations: [
    normalize(
      resolve(
        __dirname,
        '..',
        '..',
        'scripts',
        'migrations',
        'mainDB',
        '*{.ts,.js}',
      ),
    ),
  ], // Adjust based on your migrations path
  synchronize: false,
  logging: false,
};

// Create and export the DataSource
export const userDataSource = new DataSource(userDBSourceOptions);
export const mainDataSource = new DataSource(mainDBSourceOptions);
