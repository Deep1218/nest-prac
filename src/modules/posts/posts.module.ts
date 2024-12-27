import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsEntity } from './entities/posts.user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostsEntity], 'userDB')],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
