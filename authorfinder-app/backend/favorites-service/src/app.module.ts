import { Module } from '@nestjs/common';
import { FavoritesModule } from './modules/favorites.module';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI!, {
      dbName: process.env.MONGODB_DB,
    }),
    FavoritesModule,
  ],
})
export class AppModule {}