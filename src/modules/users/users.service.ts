import { Injectable, Logger } from '@nestjs/common';
import { PrismaUserService } from 'src/shared/database/prisma-user.service';
import { UserEntity } from '../../auth/entities/user.entity';

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
      return new UserEntity(userDetails);
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
