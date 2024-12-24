import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/auth/entities/users.user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(UsersEntity, 'userDB')
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async getUserDetails(userId: number) {
    try {
      const userDetails = await this.usersRepository.findOne({
        relations: { company: true },
        where: { id: userId },
      });
      return userDetails;
    } catch (error) {
      this.logger.error(`Error fetching the user details: `, error.stack);
    }
  }

  async checkUser(userId: number) {
    try {
      return await this.usersRepository.findOneBy({ id: userId });
    } catch (error) {
      this.logger.error(`Error checking the user: `, error);
    }
  }
}
