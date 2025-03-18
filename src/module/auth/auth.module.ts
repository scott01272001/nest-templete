import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefreshTokenMongodbRepository } from './repositories/refresh-token.mongodb.repository';
import { REFRESH_TOKEN_REPOSITORY } from './repositories/refresh-token.repository.interface';
import { UserMongodbRepository } from '../user/repositories/user.mongodb.repository';
import { USER_REPOSITORY } from '../user/repositories/user.repository.interface';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        privateKey: configService.get('PRIVATE_KEY'),
        publicKey: configService.get('PUBLIC_KEY'),
        signOptions: {
          algorithm: 'RS256',
          expiresIn: configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN'),
        },
        verifyOptions: {
          algorithms: ['RS256'],
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService,
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: RefreshTokenMongodbRepository
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserMongodbRepository
    }
  ],
  controllers: [AuthController]
})
export class AuthModule { }
