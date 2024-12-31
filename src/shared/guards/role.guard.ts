import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { users_role_enum } from 'prisma/user/client';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<users_role_enum[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!requiredRoles.some((role) => user.role === role)) {
      throw new ForbiddenException(
        `Access denied. You must have one of the following roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
