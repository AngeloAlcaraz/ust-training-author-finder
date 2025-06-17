import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PutCommand, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

import { ddbDocClient } from '../common/aws/dynamodb-client';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UserService {
  private readonly tableName = 'Users';

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const now = new Date().toISOString();

    const item = {
      userId: createUserDto.email,
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      gender: createUserDto.gender,
      createdAt: now,
      updatedAt: now,
      refreshToken: createUserDto.refreshToken ?? null,
    };

    const command = new PutCommand({
      TableName: this.tableName,
      Item: item,
      ConditionExpression: 'attribute_not_exists(userId)',
    });

    try {
      await ddbDocClient.send(command);
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new BadRequestException('User with this email already exists');
      }
      throw error;
    }

    return item;
  }

  async findByEmail(email: string) {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { userId: email },
    });

    const result = await ddbDocClient.send(command);
    if (!result.Item) {
      return null;
    }

    return result.Item;
  }

  async findById(id: string) {
    const user = await this.findByEmail(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateRefreshToken(userId: string, newToken: string): Promise<boolean> {
    const user = await this.findByEmail(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { userId },
      UpdateExpression: 'set refreshToken = :rt, updatedAt = :ua',
      ExpressionAttributeValues: {
        ':rt': newToken,
        ':ua': new Date().toISOString(),
      },
      ReturnValues: 'NONE', 
    });

    try {
      await ddbDocClient.send(command);
      return true;
    } catch (error) {
      console.error('Error updating refresh token:', error);
      throw new BadRequestException('Failed to update refresh token');
    }
  }
}