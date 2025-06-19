import { ConflictException, NotFoundException } from '@nestjs/common';
import { DynamoDBDocumentClient, QueryCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { FavoritesService } from '../../src/services/favorites.service';
import { FavoritesQueueService } from '../../src/queues/favorites-queue.service';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let mockFavoritesQueueService: Partial<FavoritesQueueService>;
  let mockDdbDocClientSend: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    mockDdbDocClientSend = jest.fn();

    mockFavoritesQueueService = {
      enqueueFavorite: jest.fn(),
    };

    service = new FavoritesService(mockFavoritesQueueService as FavoritesQueueService);

    // @ts-ignore
    service.ddbDocClient = {
      send: mockDdbDocClientSend,
    } as unknown as DynamoDBDocumentClient;
  });

  describe('create', () => {
    const dto = { authorId: '123', addedBy: 'user1' };

    it('should enqueue favorite and return message when favorite does NOT exist', async () => {
      mockDdbDocClientSend.mockRejectedValueOnce(new NotFoundException());

      (mockFavoritesQueueService.enqueueFavorite as jest.Mock).mockResolvedValue(undefined);

      const result = await service.create(dto);

      expect(mockDdbDocClientSend).toHaveBeenCalledWith(expect.any(GetCommand));
      expect(mockFavoritesQueueService.enqueueFavorite).toHaveBeenCalledWith({
        type: 'AddFavorite',
        ...dto,
      });
      expect(result).toEqual({
        type: 'AddFavorite',
        ...dto,
        message: 'Favorite is being processed asynchronously',
      });
    });

    it('should throw ConflictException if favorite already exists', async () => {
      mockDdbDocClientSend.mockResolvedValueOnce({ Item: dto });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if enqueue fails', async () => {
      mockDdbDocClientSend.mockRejectedValueOnce(new NotFoundException());

      (mockFavoritesQueueService.enqueueFavorite as jest.Mock).mockRejectedValue(new Error('fail'));

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findByUserId', () => {
    it('should return items from query', async () => {
      const items = [{ authorId: 'a1' }, { authorId: 'a2' }];
      mockDdbDocClientSend.mockResolvedValue({ Items: items });

      const result = await service.findByUserId('user1');

      expect(mockDdbDocClientSend).toHaveBeenCalledWith(expect.any(QueryCommand));
      expect(result).toEqual(items);
    });

    it('should return empty array if no items', async () => {
      mockDdbDocClientSend.mockResolvedValue({ Items: undefined });

      const result = await service.findByUserId('user1');

      expect(result).toEqual([]);
    });
  });

  describe('findByAuthorId', () => {
    it('should query with index and return items', async () => {
      const items = [{ addedBy: 'u1' }];
      mockDdbDocClientSend.mockResolvedValue({ Items: items });

      const result = await service.findByAuthorId('a1');

      expect(mockDdbDocClientSend).toHaveBeenCalledWith(expect.any(QueryCommand));
      expect(result).toEqual(items);
    });

    it('should return empty array if no items', async () => {
      mockDdbDocClientSend.mockResolvedValue({ Items: undefined });

      const result = await service.findByAuthorId('a1');

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return item if found', async () => {
      const item = { addedBy: 'u1', authorId: 'a1' };
      mockDdbDocClientSend.mockResolvedValue({ Item: item });

      const result = await service.findById('u1', 'a1');

      expect(mockDdbDocClientSend).toHaveBeenCalledWith(expect.any(GetCommand));
      expect(result).toEqual(item);
    });

    it('should throw NotFoundException if item not found', async () => {
      mockDdbDocClientSend.mockResolvedValue({ Item: undefined });

      await expect(service.findById('u1', 'a1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteById', () => {
    it('should enqueue remove favorite message if favorite exists', async () => {
      mockDdbDocClientSend.mockResolvedValueOnce({ Item: { addedBy: 'u1', authorId: 'a1' } });
      (mockFavoritesQueueService.enqueueFavorite as jest.Mock).mockResolvedValue(undefined);

      await service.deleteById('u1', 'a1');

      expect(mockFavoritesQueueService.enqueueFavorite).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'RemoveFavorite',
          addedBy: 'u1',
          authorId: 'a1',
          timestamp: expect.any(String),
        }),
      );
    });

    it('should throw NotFoundException if favorite does not exist', async () => {
      mockDdbDocClientSend.mockRejectedValueOnce(new NotFoundException());

      await expect(service.deleteById('u1', 'a1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if enqueue fails', async () => {
      mockDdbDocClientSend.mockResolvedValueOnce({ Item: { addedBy: 'u1', authorId: 'a1' } });
      (mockFavoritesQueueService.enqueueFavorite as jest.Mock).mockRejectedValue(new Error('fail'));

      await expect(service.deleteById('u1', 'a1')).rejects.toThrow(ConflictException);
    });
  });
});
