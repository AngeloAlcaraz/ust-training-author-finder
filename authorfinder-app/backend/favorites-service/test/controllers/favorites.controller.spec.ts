import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesController } from '../../src/controllers/favorites.controller';
import { FavoritesService } from '../../src/services/favorites.service';
import { CreateFavoriteDto } from '../../src/dtos/create-favorite.dto';

describe('FavoritesController', () => {
  let controller: FavoritesController;
  let service: FavoritesService;

  const mockFavorite = {
    id: 'fav123',
    authorId: 'OL18319A',
    name: 'Mark Twain',
    alternateNames: ['Samuel Clemens', 'S.L. Clemens'],
    birthDate: '30 November 1835',
    deathDate: '21 April 1910',
    topWork: 'Adventures of Huckleberry Finn',
    topSubjects: ['American fiction', 'Satire', 'Travel writing'],
    workCount: 5881,
    ratingsAverage: 3.84,
    ratingsCount: 574,
    addedBy: 'user123',
    addedAt: new Date('2025-06-15T18:45:00Z'),
  };

  const mockFavoritesArray = [mockFavorite];

  const mockFavoritesService = {
    create: jest.fn(dto => Promise.resolve({ ...dto, id: 'fav123' })),
    findByUserId: jest.fn(userId => Promise.resolve(userId === 'user123' ? mockFavoritesArray : [])),
    findById: jest.fn(id => Promise.resolve(id === 'fav123' ? mockFavorite : null)),
    deleteById: jest.fn(id => Promise.resolve()),
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('healthCheck', () => {
    it('should return service health status', () => {
      expect(controller.healthCheck()).toEqual({
        success: true,
        message: 'Favorites service is healthy',
        data: null,
      });
    });
  });

  describe('create', () => {
    it('should create a new favorite', async () => {
      const dto: CreateFavoriteDto = {
        authorId: 'OL18319A',
        name: 'Mark Twain',
        addedBy: 'user123',
        addedAt: new Date().toISOString(),
      };
      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Favorite created successfully');
      expect(result.data).toHaveProperty('id', 'fav123');
      expect(result.data).toHaveProperty('authorId', dto.authorId);
    });
  });

  describe('findByUser', () => {
    it('should return favorites array if user has favorites', async () => {
      const result = await controller.findByUser('user123');
      expect(service.findByUserId).toHaveBeenCalledWith('user123');
      expect(result.success).toBe(true);
      expect(result.message).toBe('Favorites retrieved successfully');
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toHaveProperty('authorId', 'OL18319A');
    });

    it('should return message if user has no favorites', async () => {
      const result = await controller.findByUser('no-user');
      expect(service.findByUserId).toHaveBeenCalledWith('no-user');
      expect(result.success).toBe(true);
      expect(result.message).toBe('No favorites found for this user');
      expect(result.data).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return favorite by id', async () => {
      const result = await controller.findOne('fav123');
      expect(service.findById).toHaveBeenCalledWith('fav123');
      expect(result.success).toBe(true);
      expect(result.message).toBe('Favorite retrieved successfully');
      expect(result.data).toHaveProperty('id', 'fav123');
    });
  });

  describe('delete', () => {
    it('should delete favorite by id', async () => {
      const result = await controller.delete('fav123');
      expect(service.deleteById).toHaveBeenCalledWith('fav123');
      expect(result.success).toBe(true);
      expect(result.message).toBe('Favorite deleted successfully');
      expect(result.data).toBeNull();
    });
  });
});
