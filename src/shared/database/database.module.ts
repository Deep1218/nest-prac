import { Module } from '@nestjs/common';
import { PrismaUserService } from './prisma-user.service';
import { PrismaMainService } from './prisma-main.service';

@Module({
  providers: [PrismaMainService, PrismaUserService],
  exports: [PrismaMainService, PrismaUserService],
})
export class DatabaseModule {}
