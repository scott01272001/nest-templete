import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import configuration from './config/configuration';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`env/.env.${process.env.NODE_ENV || 'development'}`, 'env/.env'],
      load: [configuration],
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [ConfigModule]
})
export class AppModule { }
