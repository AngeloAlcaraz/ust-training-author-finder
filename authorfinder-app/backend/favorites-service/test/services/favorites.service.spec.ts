import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from '../../src/services/favorites.service';
import { getModelToken } from '@nestjs/mongoose';
import { Favorite } from '../../src/schemas/favorite.schema';
import { ConflictException, NotFoundException } from '@nestjs/common';

interface ExecMock<T> {
  exec: () => Promise<T>;
}

interface MockModel<T> {
  find: jest.Mock<ExecMock<T[]>, [any]>;
  findById: jest.Mock<ExecMock<T | null>, [string]>;
  findByIdAndDelete: jest.Mock<ExecMock<T | null>, [string]>;
  new (dto?: any): T & { save: jest.Mock<Promise<T>, []> };
}

describe('FavoritesService', () => {
  let service: FavoritesService;
  let mockModel: MockModel<typeof mockFavorite>;

  const mockFavorite = {
    _id: 'mock-id',
    authorId: 'OL12345A',
    name: 'Jane Austen',
    addedBy: 'user123',
  };

  const saveMock = jest.fn().mockResolvedValue(mockFavorite);

  beforeEach(async () => {
    const modelMock = {
      find: jest.fn<ExecMock<typeof mockFavorite[]>, [any]>(),
      findById: jest.fn<ExecMock<typeof mockFavorite | null>, [string]>(),
      findByIdAndDelete: jest.fn<ExecMock<typeof mockFavorite | null>, [string]>(),
      prototype: {
        save: saveMock,
      },
    };

    const modelConstructorMock = jest.fn().mockImplementation((dto) => ({
      ...dto,
      save: saveMock,
    }));

    Object.assign(modelConstructorMock, modelMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        {
          provide: getModelToken(Favorite.name),
          useValue: modelConstructorMock,
        },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
    mockModel = module.get(getModelToken(Favorite.name));
  });

  describe('create', () => {
    it('should create and save a new favorite', async () => {
      const createDto = {
        authorId: 'OL12345A',
        name: 'Jane Austen',
        addedBy: 'user123',
      };

      const result = await service.create(createDto as any);

      expect(mockModel).toHaveBeenCalledWith(createDto);
      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual(mockFavorite);
    });

    it('should throw ConflictException if favorite already exists', async () => {
      const createDto = {
        authorId: 'OL12345A',
        name: 'Jane Austen',
        addedBy: 'user123',
      };

      const conflictError = { code: 11000 };
      saveMock.mockRejectedValueOnce(conflictError);

      await expect(service.create(createDto as any)).rejects.toThrow(
        ConflictException,
      );

      saveMock.mockResolvedValue(mockFavorite);
    });
  });

  describe('findByUserId', () => {
    it('should return all favorites for a user', async () => {
      const favorites = [mockFavorite];
      mockModel.find.mockReturnValueOnce({
        exec: () => Promise.resolve(favorites),
      });

      const result = await service.findByUserId('user123');

      expect(mockModel.find).toHaveBeenCalledWith({ addedBy: 'user123' });
      expect(result).toEqual(favorites);
    });
  });

  describe('findById', () => {
    it('should return a favorite by id', async () => {
      mockModel.findById.mockReturnValueOnce({
        exec: () => Promise.resolve(mockFavorite),
      });

      const result = await service.findById('mock-id');

      expect(mockModel.findById).toHaveBeenCalledWith('mock-id');
      expect(result).toEqual(mockFavorite);
    });

    it('should throw NotFoundException if favorite not found', async () => {
      mockModel.findById.mockReturnValueOnce({
        exec: () => Promise.resolve(null),
      });

      await expect(service.findById('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteById', () => {
    it('should delete a favorite by id', async () => {
      mockModel.findByIdAndDelete.mockReturnValueOnce({
        exec: () => Promise.resolve(mockFavorite),
      });

      await expect(service.deleteById('mock-id')).resolves.not.toThrow();
    });

    it('should throw NotFoundException if favorite not found', async () => {
      mockModel.findByIdAndDelete.mockReturnValueOnce({
        exec: () => Promise.resolve(null),
      });

      await expect(service.deleteById('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
