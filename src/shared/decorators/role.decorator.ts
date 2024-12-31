import { SetMetadata } from '@nestjs/common';
import { users_role_enum } from 'prisma/user/client';

export const Roles = (...roles: users_role_enum[]) =>
  SetMetadata('roles', roles);
