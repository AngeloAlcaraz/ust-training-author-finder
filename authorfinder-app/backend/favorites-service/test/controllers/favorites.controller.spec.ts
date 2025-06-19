import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesController } from '../../src/controllers/favorites.controller';
import { FavoritesService } from '../../src/services/favorites.service';
import { CreateFavoriteDto } from '../../src/dtos/create-favorite.dto';
import { FavoriteResponseDto } from '../../src/dtos/favorite-response.dto';
import { plainToInstance } from 'class-transformer';

describe('FavoritesController', () => {
  let controller: FavoritesController;
  let service: FavoritesService;

  const mockFavoritesService = {
    create: jest.fn(),
    findByUserId: jest.fn(),
    findById: jest.fn(),
    deleteById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritesController],
      providers: [
        {
          provide: FavoritesService,
          useValue: mockFavoritesService,
        },
      ],
    }).compile();

    controller = module.get<FavoritesController>(FavoritesController);
    service = module.get<FavoritesService>(FavoritesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('healthCheck', () => {
    it('should return service health status', () => {
      const result = controller.healthCheck();
      expect(result).toEqual({
        success: true,
        message: 'Favorites service is healthy',
        data: null,
      });
    });
  });

  describe('create', () => {
    it('should create a new favorite and return response DTO', async () => {
      const dto: CreateFavoriteDto = {
        addedBy: 'user1',
        authorId: 'author1',
        name: 'Mark Twain',
        addedAt: '',
        birthDate: '1980-01-01'
      };

      mockFavoritesService.create.mockResolvedValue(dto);

      const response = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(response.success).toBe(true);
      expect(response.message).toBe('Favorite created successfully');
      expect(response.data).toEqual(plainToInstance(FavoriteResponseDto, dto, { excludeExtraneousValues: true }));
    });
  });

  describe('findByUser', () => {
    it('should return list of favorites for a user', async () => {
      const favorites = [
        { addedBy: 'user1', authorId: 'author1', name: 'Mark Twain' },
        { addedBy: 'user1', authorId: 'author2', name: 'Jane Austen' },
      ];

      mockFavoritesService.findByUserId.mockResolvedValue(favorites);

      const response = await controller.findByUser('user1');

      expect(service.findByUserId).toHaveBeenCalledWith('user1');
      expect(response.success).toBe(true);
      expect(response.message).toBe('Favorites retrieved successfully');
      expect(response.data).toEqual(plainToInstance(FavoriteResponseDto, favorites, { excludeExtraneousValues: true }));
    });

    it('should return no favorites message if none found', async () => {
      mockFavoritesService.findByUserId.mockResolvedValue([]);

      const response = await controller.findByUser('user1');

      expect(service.findByUserId).toHaveBeenCalledWith('user1');
      expect(response.success).toBe(true);
      expect(response.message).toBe('No favorites found for this user');
      expect(response.data).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return favorite details', async () => {
      const favorite = { addedBy: 'user1', authorId: 'author1', name: 'Mark Twain' };

      mockFavoritesService.findById.mockResolvedValue(favorite);

      const response = await controller.findOne('user1', 'author1');

      expect(service.findById).toHaveBeenCalledWith('user1', 'author1');
      expect(response.success).toBe(true);
      expect(response.message).toBe('Favorite retrieved successfully');
      expect(response.data).toEqual(plainToInstance(FavoriteResponseDto, favorite, { excludeExtraneousValues: true }));
    });
  });

  describe('delete', () => {
    it('should delete favorite and return success message', async () => {
      mockFavoritesService.deleteById.mockResolvedValue(undefined);

      const response = await controller.delete('user1', 'author1');

      expect(service.deleteById).toHaveBeenCalledWith('user1', 'author1');
      expect(response).toEqual({
        success: true,
        message: 'Favorite deleted successfully',
        data: null,
      });
    });
  });
});
