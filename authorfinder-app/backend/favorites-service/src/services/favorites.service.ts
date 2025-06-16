import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favorite } from '../schemas/favorite.schema';
import { CreateFavoriteDto } from '../dtos/create-favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite.name) private readonly favoriteModel: Model<Favorite>,
  ) { }

  async create(createFavoriteDto: CreateFavoriteDto): Promise<Favorite> {
    try {
      const createdFavorite = new this.favoriteModel(createFavoriteDto);
      return await createdFavorite.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('This author is already in your favorites.');
      }
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<Favorite[]> {
    return this.favoriteModel.find({ addedBy: userId }).exec();
  }

  async findById(id: string): Promise<Favorite> {
    const favorite = await this.favoriteModel.findById(id).exec();
    if (!favorite) {
      throw new NotFoundException('Favorite not found.');
    }
    return favorite;
  }

  async deleteById(id: string): Promise<void> {
    const result = await this.favoriteModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Favorite not found.');
    }
  }
}
