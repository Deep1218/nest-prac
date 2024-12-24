import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entities/users.user.entity';
import { TokensEntity } from './entities/tokens.user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,

        privateKey: Buffer.from(
          configService.get<string>('JWT_PRIVATE_KEY'),
          'base64',
        ).toString('utf-8'),

        publicKey: Buffer.from(
          configService.get<string>('JWT_PUBLIC_KEY'),
          'base64',
        ).toString('utf-8'),

        signOptions: {
          algorithm: 'RS256',
          expiresIn: configService.get<string>('JWT_TOKEN_EXPIRY_TIME'),
        },
      }),
    }),
    TypeOrmModule.forFeature([UsersEntity, TokensEntity], 'userDB'),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
