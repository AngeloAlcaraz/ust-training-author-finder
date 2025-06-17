import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  GetCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';

@Injectable()
export class FavoritesService {
  private readonly ddbClient: DynamoDBClient;
  private readonly ddbDocClient: DynamoDBDocumentClient;
  private readonly tableName = 'Favorites';

  constructor() {
    this.ddbClient = new DynamoDBClient({});
    this.ddbDocClient = DynamoDBDocumentClient.from(this.ddbClient);
  }

  async create(createFavoriteDto: any): Promise<any> {
    const key = {
      addedBy: createFavoriteDto.addedBy,
      authorId: createFavoriteDto.authorId,
    };

    const existing = await this.ddbDocClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: key,
      }),
    );

    if (existing.Item) {
      throw new ConflictException('This author is already in your favorites.');
    }

    await this.ddbDocClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: createFavoriteDto,
      }),
    );

    return createFavoriteDto;
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
    const params = {
      TableName: this.tableName,
      Key: {
        addedBy,
        authorId,
      },
      ReturnValues: 'ALL_OLD' as const,
    };

    const result = await this.ddbDocClient.send(new DeleteCommand(params));
    if (!result.Attributes) {
      throw new NotFoundException('Favorite not found.');
    }
  }
}
