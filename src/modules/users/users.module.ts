import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersEntity } from 'src/auth/entities/users.user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity], 'userDB')],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
