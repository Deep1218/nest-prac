import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PrismaUserService } from 'src/shared/database/prisma-user.service';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);
  constructor(private readonly prismaService: PrismaUserService) {}

  create(data: any) {
    try {
      return this.prismaService.posts.create({ data });
    } catch (error) {
      this.logger.error(`Error while creating post: `, error.stack);
    }
  }
}
