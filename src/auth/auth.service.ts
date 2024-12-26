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
  ) {}

  private async createUserWithCompany(
    userData: Partial<UsersEntity>,
    companyDetails?: Partial<CompaniesEntity>,
  ) {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      // Step 1: Create the user
      const { password = '' } = userData;
      userData.password = await this.encryptPassword(password);
      const user = manager.create(UsersEntity, userData);

      // Step 2: If the user role is 'Admin', create a company for the user
      // and if user role is 'viewer' / 'editor' than fetch & add it to user
      if ([UserRole.VIEWER, UserRole.EDITOR].includes(userData.role)) {
        const company = await manager.findOne(CompaniesEntity, {
          where: { id: companyDetails.id },
        });
        if (!company) {
          throw new BadRequestException(
            "Company with the provided id doesn't exists!",
          );
        }
        user.company = company;
      } else if (userData.role === UserRole.ADMIN) {
        const company = manager.create(CompaniesEntity, companyDetails);

        const newCompany = await manager.save(CompaniesEntity, company);
        user.company = newCompany;
      }
      const savedUser = await manager.save(UsersEntity, user);

      // Step 3: Return the created user with the company
      const activity = {
        userId: savedUser.id,
        companyId: savedUser.company.id,
        type: LogTypes.MEMBER_ADDED,
        description: `${userData.firstName} ${userData.lastName} is added as ${userData.role}.`,
      };
      this.addActivity(activity);
      return savedUser;
    });
  }
  async addActivity(actvityDetails: Record<string, any>) {
    try {
      const activity = this.activityRepository.create(actvityDetails);
      await this.activityRepository.insert(activity);
    } catch (error) {
      this.logger.error(`Error while addding the activity`, error.stack);
    }
  }
  async loginProcess(userDetails: CreateUserDto, user?: UsersEntity) {
    try {
      const password = userDetails.password;
      let userData =
        user ??
        (await this.createUserWithCompany(
          userDetails,
          userDetails?.companyDetails,
        ));

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
          user: userData.id,
          company: userData.company.id,
          type: LogTypes.MEMBER_LOGEDIN,
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
        const tokenExists = await this.tokensRepository.findOne({
          where: { userId, type },
        });
        if (tokenExists) {
          data['id'] = tokenExists.id;
        }
      } else {
        data.expireAt = new Date(data.expireAt.getTime() + 60 * 60 * 1000); // Add 1 hour in milliseconds
      }
      return this.tokensRepository.save(data);
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

  async findOne(condition: Record<string, any>) {
    try {
      return this.usersRepository.findOne({
        relations: { company: true },
        where: { ...condition, isDeleted: false, status: UserStatus.ACTIVE },
      });
    } catch (error) {
      this.logger.error(`Error while fetching the user: `, error.stack);
    }
  }

  async checkEmailExists(email: string) {
    try {
      return this.findOne({ email, isDeleted: false });
    } catch (error) {
      this.logger.error(`Error while checking email: `, error.stack);
    }
  }

  async generateAccessToken(refreshToken: string) {
    try {
      const result = await this.jwtService.verifyAsync(refreshToken);
      const tokenExists = await this.tokensRepository.findOne({
        where: { userId: result.sub, type: TokenType.REFRESH },
      });
      const userData = await this.findOne({ id: tokenExists.userId });
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
