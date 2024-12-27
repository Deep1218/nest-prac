import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsEntity } from './entities/posts.user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);
  constructor(
    @InjectRepository(PostsEntity, 'userDB')
    private readonly postRepository: Repository<PostsEntity>,
  ) {}

  create(data: Record<string, any>) {
    try {
      const post = this.postRepository.create(data);
      return this.postRepository.save(post);
    } catch (error) {
      this.logger.error(`Error while creating post: `, error.stack);
    }
  }
  // newPost(){}
}
