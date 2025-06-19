import { NestFactory } from '@nestjs/core';
import { AuthModule } from './modules/auth.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigureSwaggerUI } from './swagger.config';

const PORT = process.env.PORT || 4000; // TODO: Use a config service for better management
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*'; // TODO: Use a config service for better management

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AuthModule,
    { abortOnError: false } // Prevent Nest from crashing on unhandled exceptions, delete this line if you want the default behavior
  );

  app.enableCors({
    origin: CORS_ORIGIN,
    methods: 'GET,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  ConfigureSwaggerUI(app);
  await app.listen(PORT, () => {
    console.log(`🚀 Auth service is running on port ${PORT}`);
  });
}
bootstrap();
