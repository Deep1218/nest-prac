import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  private logger = new Logger(UsersController.name);
  constructor(private readonly userService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  getProfile(@Req() req: any) {
    try {
      return this.userService.getUserDetails(req.user.id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/all')
  users() {
    try {
      return this.userService.getAllUser();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
