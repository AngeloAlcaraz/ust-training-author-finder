import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FavoritesService } from '../services/favorites.service';
import { FavoritesController } from '../controllers/favorites.controller';
import { LoggingMiddleware } from 'src/common/middleware/logging-middleware';

@Module({
  imports: [
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes(FavoritesController);
  }
}
