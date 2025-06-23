import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import 'dotenv/config'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map((err) =>
          err.constraints ? Object.values(err.constraints).join(', ') : '',
        );
        return new BadRequestException(messages);
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Favorites Microservice')
    .setDescription('API to manage favorites for users')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0', () => {
    console.log(`🚀 Favorites service is running on port ${process.env.PORT ?? 3001}`);
    console.log(`🧭 Swagger UI is available at http://localhost:${process.env.PORT ?? 3001}/api`);
  });
}

bootstrap();