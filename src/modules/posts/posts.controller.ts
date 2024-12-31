import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Roles } from 'src/shared/decorators/role.decorator';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-posts.dto';
import { users_role_enum } from 'prisma/user/client';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);
  constructor(private readonly postsService: PostsService) {}

  @Roles(users_role_enum.editor)
  @UseGuards(RoleGuard)
  @Post()
  createPost(@Body() postDetails: CreatePostDto, @Req() req: any) {
    return this.postsService.create(postDetails);
  }
}
