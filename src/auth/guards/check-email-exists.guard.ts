import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class CheckEmailExistsGuard implements CanActivate {
  // private logger = new Logger(CheckEmailExistsGuard.name)

  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const { body = {} } = request;

    const emailExists = await this.authService.checkEmailExists(
      body.email ?? '',
    );

    if (emailExists) {
      throw new BadRequestException('Email already exists');
    }

    return true;
  }
}
