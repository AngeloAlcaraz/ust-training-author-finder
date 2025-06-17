import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { FavoritesService } from '../services/favorites.service';
import { CreateFavoriteDto } from '../dtos/create-favorite.dto';
import { FavoriteResponseDto } from '../dtos/favorite-response.dto';
import { plainToInstance } from 'class-transformer';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) { }

  @Get('health')
  @ApiOperation({ summary: 'Health check for the favorites service' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  healthCheck() {
    return {
      success: true,
      message: 'Favorites service is healthy',
      data: null,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new favorite' })
  @ApiResponse({
    status: 201,
    description: 'Favorite created successfully',
    type: FavoriteResponseDto,
  })
  async create(@Body() createFavoriteDto: CreateFavoriteDto) {
    const favorite = await this.favoritesService.create(createFavoriteDto);
    const transformed = plainToInstance(FavoriteResponseDto, favorite, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Favorite created successfully',
      data: transformed,
    };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get favorites by user ID' })
  @ApiResponse({
    status: 200,
    description: 'Favorites retrieved successfully',
    type: [FavoriteResponseDto],
  })
  async findByUser(@Param('userId') userId: string) {
    const favorites = await this.favoritesService.findByUserId(userId);
    const transformed = plainToInstance(FavoriteResponseDto, favorites, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: favorites.length
        ? 'Favorites retrieved successfully'
        : 'No favorites found for this user',
      data: transformed,
    };
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get favorite details by ID' })
  @ApiResponse({
    status: 200,
    description: 'Favorite retrieved successfully',
    type: FavoriteResponseDto,
  })
  async findOne(@Param('id') id: string) {
    const favorite = await this.favoritesService.findById(id);
    const transformed = plainToInstance(FavoriteResponseDto, favorite, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Favorite retrieved successfully',
      data: transformed,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a favorite by ID' })
  @ApiResponse({
    status: 200,
    description: 'Favorite deleted successfully',
  })
  async delete(@Param('id') id: string) {
    await this.favoritesService.deleteById(id);
    return {
      success: true,
      message: 'Favorite deleted successfully',
      data: null,
    };
  }
}
