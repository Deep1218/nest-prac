import {
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Req,
  UseGuards,
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

  @Get()
  getProfile(@Req() req: any) {
    try {
      return this.userService.getUserDetails(req.user.id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
