import { ConflictException, NotFoundException } from '@nestjs/common';
import { FavoritesService } from '../../src/services/favorites.service';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

jest.mock('@aws-sdk/client-dynamodb');
jest.mock('@aws-sdk/lib-dynamodb');

describe('FavoritesService', () => {
  let service: FavoritesService;
  let sendMock: jest.Mock;

  beforeEach(() => {
    sendMock = jest.fn();

    (DynamoDBClient as jest.Mock).mockImplementation(() => ({}));
    (DynamoDBDocumentClient.from as jest.Mock).mockReturnValue({
      send: sendMock,
    });

    service = new FavoritesService();
  });

  describe('create', () => {
    it('should create a new favorite when it does not exist', async () => {
      // Simula que no existe el item (GetCommand)
      sendMock.mockResolvedValueOnce({ Item: undefined });
      // Simula éxito en creación (PutCommand)
      sendMock.mockResolvedValueOnce({});

      const dto = { addedBy: 'user1', authorId: 'author1', name: 'Mark Twain' };

      const result = await service.create(dto);

      expect(sendMock).toHaveBeenCalledTimes(2);
      expect(result).toEqual(dto);
    });

    it('should throw ConflictException if favorite already exists', async () => {
      sendMock.mockResolvedValueOnce({ Item: { addedBy: 'user1', authorId: 'author1' } });

      const dto = { addedBy: 'user1', authorId: 'author1', name: 'Mark Twain' };

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(sendMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByUserId', () => {
    it('should return list of favorites for user', async () => {
      const items = [{ authorId: 'author1' }, { authorId: 'author2' }];
      sendMock.mockResolvedValueOnce({ Items: items });

      const result = await service.findByUserId('user1');

      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual(items);
    });

    it('should return empty array if none found', async () => {
      sendMock.mockResolvedValueOnce({ Items: undefined });

      const result = await service.findByUserId('user1');

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should throw NotFoundException if item not found', async () => {
      sendMock.mockResolvedValueOnce({ Item: undefined });

      await expect(service.findById('user1', 'author1')).rejects.toThrow(NotFoundException);
    });

    it('should return item if found', async () => {
      const item = { addedBy: 'user1', authorId: 'author1' };
      sendMock.mockResolvedValueOnce({ Item: item });

      const result = await service.findById('user1', 'author1');

      expect(result).toEqual(item);
    });
  });

  describe('findByAuthorId', () => {
    it('should return favorites by authorId', async () => {
      const items = [{ addedBy: 'user1' }, { addedBy: 'user2' }];
      sendMock.mockResolvedValueOnce({ Items: items });

      const result = await service.findByAuthorId('author1');

      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual(items);
    });

    it('should return empty array if none found', async () => {
      sendMock.mockResolvedValueOnce({ Items: undefined });

      const result = await service.findByAuthorId('author1');

      expect(result).toEqual([]);
    });
  });

  describe('deleteById', () => {
    it('should throw NotFoundException if no item deleted', async () => {
      sendMock.mockResolvedValueOnce({ Attributes: undefined });

      await expect(service.deleteById('user1', 'author1')).rejects.toThrow(NotFoundException);
    });

    it('should delete item if exists', async () => {
      sendMock.mockResolvedValueOnce({ Attributes: { addedBy: 'user1', authorId: 'author1' } });

      await expect(service.deleteById('user1', 'author1')).resolves.toBeUndefined();
    });
  });
});
