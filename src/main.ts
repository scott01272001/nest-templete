import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RemovePasswordItcInterceptor } from './interceptor/remove-password-itc/remove-password-itc.interceptor';
import { JwtAuthenticationGuard } from './guard/jwt-authentication.guard';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './module/user/user.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // pipe
  app.useGlobalPipes(new ValidationPipe());
  // interceptor
  app.useGlobalInterceptors(new RemovePasswordItcInterceptor());
  // guard
  app.useGlobalGuards(new JwtAuthenticationGuard(app.get(JwtService), app.get(UserService), app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('Nest API')
    .setDescription('The Nest API description')
    .setVersion('1.0')
    .addTag('nest')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
