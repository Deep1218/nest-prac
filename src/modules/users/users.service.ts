import { Injectable, Logger } from '@nestjs/common';
import { PrismaUserService } from 'src/shared/database/prisma-user.service';
import { UserEntity } from '../../auth/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { users_role_enum } from 'prisma/user/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private readonly prismaService: PrismaUserService) {}

  async getUserDetails(userId: number) {
    try {
      const userDetails = await this.prismaService.users.findFirst({
        where: { id: userId },
        include: { company: true },
      });
      return plainToInstance(UserEntity, userDetails);
    } catch (error) {
      this.logger.error(`Error fetching the user details: `, error.stack);
    }
  }

  async getAllUser() {
    try {
      const users = await this.prismaService.users.findMany({
        where: {
          isDeleted: false,
          status: 1,
          NOT: { role: users_role_enum.super_admin },
        },
      });
      return plainToInstance(UserEntity, users);
    } catch (error) {
      this.logger.error(`Error fetching the user details: `, error.stack);
    }
  }

  async checkUser(userId: number) {
    try {
      return await this.prismaService.users.findFirst({
        where: { id: userId },
      });
    } catch (error) {
      this.logger.error(`Error checking the user: `, error);
    }
  }
}
