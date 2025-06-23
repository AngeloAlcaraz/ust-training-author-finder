import { Module } from '@nestjs/common';
import { FavoritesModule } from './modules/favorites.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),    
    FavoritesModule,
  ],
})
export class AppModule {}
