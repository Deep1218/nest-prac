import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

import { mainDataSource, userDataSource } from './config/database/data.source';
import { WinstonLogger } from './config/logger/winston.logger';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './modules/users/users.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolve('.', 'environments', `.env.${process.env.NODE_ENV}`),
    }),
    TypeOrmModule.forRoot({
      ...userDataSource.options,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forRoot({
      ...mainDataSource.options,
      autoLoadEntities: true,
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, WinstonLogger],
})
export class AppModule {}
