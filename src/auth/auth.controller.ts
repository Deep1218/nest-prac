import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Logger,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { CheckEmailExistsGuard } from './guards/check-email-exists.guard';
import { CheckUserExistsGuard } from './guards/check-user-exists.guard';

@Controller('auth')
export class AuthController {
  private logger = new Logger();

  constructor(private authservice: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(CheckUserExistsGuard)
  @Post('login')
  login(@Body() userDetails: CreateUserDto, @Req() req: any) {
    try {
      if (req.isUserExists) {
        this.logger.log(`User already exists: `, req.user);
        return this.authservice.loginProcess(userDetails, req.user);
      }
      return this.authservice.loginProcess(userDetails);
    } catch (error) {}
  }
}
