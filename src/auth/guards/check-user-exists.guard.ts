import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class CheckUserExistsGuard implements CanActivate {
  // private logger = new Logger(CheckUserExistsGuard.name)
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const { body = {} } = request;
    const { email = '', password = '' } = body;

    request['isUserExists'] = false;

    const userExists = await this.authService.findOne({
      email,
    });

    if (userExists) {
      const matched = await this.authService.verifyPassword(
        password,
        userExists.password,
      );
      if (matched) {
        request.isUserExists = true;
        request['user'] = userExists;
      }
    }

    return true;
  }
}
