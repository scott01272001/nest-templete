import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule { }
