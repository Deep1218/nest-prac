import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { CheckUserExistsGuard } from './guards/check-user-exists.guard';
import { GenerateTokenDTO } from './dto/generate-token.dto';

@Controller('auth')
export class AuthController {
  private logger = new Logger();

  constructor(private authservice: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(CheckUserExistsGuard)
  @Post('login')
  login(@Body() userDetails: CreateUserDto, @Req() req: any) {
    return this.authservice.loginProcess(userDetails, req.user ?? null);
  }
  @Post('generate-token')
  generateToken(@Body() tokenDetails: GenerateTokenDTO, @Req() req: any) {
    return this.authservice.generateAccessToken(tokenDetails.refreshToken);
  }
}
