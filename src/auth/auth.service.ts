import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UserRole,
  UsersEntity,
  UserStatus,
} from './entities/users.user.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { TokensEntity, TokenType } from './entities/tokens.user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';
import { CompaniesEntity } from 'src/modules/users/entities/companies.user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(UsersEntity, 'userDB')
    private usersRepository: Repository<UsersEntity>,
    @InjectRepository(TokensEntity, 'userDB')
    private tokensRepository: Repository<TokensEntity>,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async createUserWithCompany(
    userData: Partial<UsersEntity>,
    comapnyDetails?: Partial<CompaniesEntity>,
  ): Promise<any> {
    try {
      return this.dataSource.transaction(async (manager: EntityManager) => {
        // Step 1: Create the user
        const { password = '' } = userData;
        userData.password = await this.encryptPassword(password);
        const user = manager.create(UsersEntity, userData);
        const savedUser = await manager.save(UsersEntity, user);

        // Step 2: If the user role is 'Admin', create a company for the user
        if (userData.role === UserRole.ADMIN) {
          const company = manager.create(CompaniesEntity, {
            userId: savedUser.id,
            ...comapnyDetails,
          });

          await manager.save(CompaniesEntity, company);
        }
        // Step 3: Return the created user (with or without the company)
        return savedUser;
      });
    } catch (error) {
      this.logger.error(`In user transcation: `, error.stack);
    }
  }

  private async createUser(data): Promise<UsersEntity> {
    try {
      data.password = await this.encryptPassword(data.password);
      const newUser = await this.usersRepository.save(data);
      return newUser;
    } catch (error) {
      this.logger.error('Error insert new user query: ', error.stack);
    }
  }

  async loginProcess(userDetails: CreateUserDto, user?: UsersEntity) {
    try {
      let userData =
        user ??
        (await this.createUserWithCompany(
          userDetails,
          userDetails?.comapnyDetails,
        ));

      const passwordVerified = await this.verifyPassword(
        userDetails.password,
        userData.password,
      );

      if (passwordVerified) {
        const payload = {
          sub: userData.id,
          email: userData.email,
          role: userData.role,
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
        return { ...userData, accessToken, refreshToken };
      }
      return new UnauthorizedException('Invalid credentials');
    } catch (error) {
      this.logger.error('Error while creating user: ', error.stack);
    }
  }
  async storeToken(userId: number, token: string, type: TokenType) {
    try {
      let expireAt = new Date();
      if (type === TokenType.REFRESH) {
        expireAt = new Date(expireAt.getTime() + 60 * 24 * 60 * 60 * 1000); // Add 60 days in milliseconds
      } else {
        expireAt = new Date(expireAt.getTime() + 60 * 60 * 1000); // Add 1 hour in milliseconds
      }
      return this.tokensRepository.save({ userId, token, type, expireAt });
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
}
