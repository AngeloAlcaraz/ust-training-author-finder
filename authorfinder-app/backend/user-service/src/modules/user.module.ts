import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { UsersController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { LoggingMiddleware } from '../common/middleware/logging-middleware';
import { DynamoModule } from './dynamo.module';

@Module({
  imports: [DynamoModule],
  controllers: [UsersController],
  providers: [UserService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes(UsersController);
  }
}
