import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  UserRole,
  UsersEntity,
  UserStatus,
} from './entities/users.user.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { TokensEntity, TokenType } from './entities/tokens.user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { CompaniesEntity } from '../modules/users/entities/companies.user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ActivitiesEntity, LogTypes } from './entities/activities.main.entity';
import { PrismaUserService } from 'src/shared/database/prisma-user.service';
import { PrismaMainService } from 'src/shared/database/prisma-main.service';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(UsersEntity, 'userDB')
    private usersRepository: Repository<UsersEntity>,
    @InjectRepository(TokensEntity, 'userDB')
    private tokensRepository: Repository<TokensEntity>,
    @InjectRepository(ActivitiesEntity)
    private activityRepository: Repository<ActivitiesEntity>,
    @InjectDataSource('userDB')
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaUserService,
    private readonly prismaMainService: PrismaMainService,
  ) {}
  async createUserWithCompanyPrisma(userData: any, companyDetails?: any) {
    return await this.prismaService.$transaction(async (prisma) => {
      // Step 1: Encrypt the password and create the user
      const { password = '' } = userData;
      userData.password = await this.encryptPassword(password);

      // Step 2: Handle roles and company associations
      let savedUser;
      if ([UserRole.VIEWER, UserRole.EDITOR].includes(userData.role)) {
        savedUser = await prisma.users.create({
          data: {
            ...userData,
            company: {
              connect: {
                id: companyDetails.id,
              },
            },
          },
          include: { company: true },
        });
        this.addActivity({
          userId: savedUser.id,
          companyId: savedUser.companyId,
          type: 'new_memeber_add',
          description: `${userData.firstName} ${userData.lastName} is added as ${userData.role}.`,
        });
      } else if (userData.role === UserRole.ADMIN) {
        savedUser = await prisma.users.create({
          data: {
            ...userData,
            company: {
              create: companyDetails,
            },
          },
          include: { company: true },
        });
      }

      // Return the created user
      return savedUser;
    });
  }
  async addActivity(actvityDetails: any) {
    try {
      await this.prismaMainService.activities.create({
        data: actvityDetails,
      });
    } catch (error) {
      this.logger.error(`Error while addding the activity`, error.stack);
    }
  }
  async loginProcess(userDetails: CreateUserDto, user?: any) {
    try {
      const password = userDetails.password;
      const { companyDetails = null, ...userDetail } = userDetails;
      let userData =
        user ??
        (await this.createUserWithCompanyPrisma(userDetail, companyDetails));

      const passwordVerified = await this.verifyPassword(
        password,
        userData.password,
      );

      if (passwordVerified) {
        const payload = {
          sub: userData.id,
          email: userData.email,
          role: userData.role,
        };
        const activity = {
          userId: userData.id,
          companyId: userData.companyId,
          type: 'memeber_loged_in',
          description: `${userData.firstName} ${userData.lastName} (${userData.role}) has loged in to the portal.`,
        };

        const accessToken = this.jwtService.sign(payload, {
          expiresIn: this.configService.get<string>('JWT_TOKEN_EXPIRY_TIME'),
        });
        const refreshToken = this.jwtService.sign(payload, {
          expiresIn: this.configService.get<string>(
            'JWT_REFRESH_TOKEN_EXPIRY_TIME',
          ),
        });
        this.storeToken(userData.id, refreshToken, TokenType.REFRESH);
        this.addActivity(activity);
        return { ...userData, accessToken, refreshToken };
      }
      throw new UnauthorizedException('Invalid cred!!');
    } catch (error) {
      this.logger.error('Error while creating user: ', error.stack);
      throw error;
    }
  }
  async storeToken(userId: number, token: string, type: TokenType) {
    try {
      const data = { userId, token, type, expireAt: new Date() };
      if (type === TokenType.REFRESH) {
        data.expireAt = new Date(
          data.expireAt.getTime() + 60 * 24 * 60 * 60 * 1000,
        ); // Add 60 days in milliseconds
        const tokenExists = await this.prismaService.tokens.findFirst({
          where: { userId, type },
        });
        if (tokenExists) {
          return await this.prismaService.tokens.update({
            where: { id: tokenExists.id },
            data: { expireAt: data.expireAt },
          });
        }
      } else {
        data.expireAt = new Date(data.expireAt.getTime() + 60 * 60 * 1000); // Add 1 hour in milliseconds
      }
      return this.prismaService.tokens.create({ data });
    } catch (error) {
      this.logger.error('Error storing token: ', error.stack);
    }
  }

  async encryptPassword(plainPassword: string) {
    try {
      // Define the salt rounds (10 is a good default)
      const saltRounds = 10;

      // Generate a salt
      const salt = await bcrypt.genSalt(saltRounds);

      // Hash the password with the salt
      const hashedPassword = await bcrypt.hash(plainPassword, salt);

      return hashedPassword;
    } catch (error) {
      this.logger.error('Error encrypting password:', error);
      // throw new Error('Password encryption failed.');
    }
  }

  async verifyPassword(plainPassword, hashedPassword) {
    try {
      // true if password matches, false otherwise
      return bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      this.logger.error('Error verifying password:', error);
      // throw new Error('Password verification failed.');
    }
  }

  async findOne(condition: any) {
    try {
      return this.prismaService.users.findFirst({
        where: {
          ...condition,
          isDeleted: false,
          status: UserStatus.ACTIVE,
        },
        include: { company: true },
      });
    } catch (error) {
      this.logger.error(`Error while fetching the user: `, error.stack);
    }
  }
  async generateAccessToken(refreshToken: string) {
    try {
      const result = await this.jwtService.verifyAsync(refreshToken);
      const tokenExists = await this.prismaService.tokens.findFirst({
        where: { userId: result.sub, type: TokenType.REFRESH },
      });
      const userData = await this.findOne({ id: Number(tokenExists.userId) });
      const payload = {
        sub: userData.id,
        email: userData.email,
        role: userData.role,
      };
      const accessToken = this.jwtService.sign(payload, {
        expiresIn: this.configService.get<string>('JWT_TOKEN_EXPIRY_TIME'),
      });
      return { accessToken };
    } catch (error) {
      this.logger.error(`Error in generating access token: `, error.stack);
      throw new BadRequestException('Invalid refresh token!');
    }
  }
}
