import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Favorite, FavoriteSchema } from '../schemas/favorite.schema';
import { FavoritesService } from '../services/favorites.service';
import { FavoritesController } from '../controllers/favorites.controller';
import { LoggingMiddleware } from 'src/common/middleware/logging-middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Favorite.name, schema: FavoriteSchema, collection: 'favorites' },
    ]),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes(FavoritesController);
  }
}