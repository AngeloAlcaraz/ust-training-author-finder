import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { FavoritesQueueService } from '../queues/favorites-queue.service';

@Injectable()
export class FavoritesService {
  private readonly ddbClient: DynamoDBClient;
  private readonly ddbDocClient: DynamoDBDocumentClient;
  private readonly tableName = 'Favorites';

  constructor(private readonly favoritesQueueService: FavoritesQueueService) {
    this.ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
    this.ddbDocClient = DynamoDBDocumentClient.from(this.ddbClient);
  }

  async create(createFavoriteDto: any): Promise<any> {
    try {
      await this.findById(createFavoriteDto.addedBy, createFavoriteDto.authorId);
      throw new ConflictException('Favorite already exists');
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        throw error;
      }
    }

    const payload = {
      type: 'AddFavorite',
      ...createFavoriteDto,
    };

    try {
      await this.favoritesQueueService.enqueueFavorite(payload);
    } catch (error) {
      console.error('Error sending message to the queue:', error);
      throw new ConflictException('Error sending message to the queue');
    }

    return {
      ...payload,
      message: 'Favorite is being processed asynchronously',
    };
  }

  async findByUserId(userId: string): Promise<any[]> {
    const result = await this.ddbDocClient.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'addedBy = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      }),
    );

    return result.Items || [];
  }

  async findByAuthorId(authorId: string): Promise<any[]> {
    const result = await this.ddbDocClient.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'authorId-addedAt-index',
        KeyConditionExpression: 'authorId = :authorId',
        ExpressionAttributeValues: {
          ':authorId': authorId,
        },
        ScanIndexForward: false,
      }),
    );

    return result.Items || [];
  }

  async findById(addedBy: string, authorId: string): Promise<any> {
    const params = {
      TableName: this.tableName,
      Key: {
        addedBy,
        authorId,
      },
    };

    const result = await this.ddbDocClient.send(new GetCommand(params));
    if (!result.Item) {
      throw new NotFoundException('Favorite not found.');
    }

    return result.Item;
  }

  async deleteById(addedBy: string, authorId: string): Promise<void> {
    try {
      await this.findById(addedBy, authorId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Favorite not found');
      }
      throw error;
    }

    const message = {
      type: 'RemoveFavorite',
      addedBy,
      authorId,
      timestamp: new Date().toISOString(),
    };

    try {
      await this.favoritesQueueService.enqueueFavorite(message);
    } catch (error) {
      console.error('Error sending delete message to the queue:', error);
      throw new ConflictException('Error sending delete message to the queue');
    }
  }
}
