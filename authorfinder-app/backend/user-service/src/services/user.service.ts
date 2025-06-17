import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

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
    
    const { password, ...userWithoutPassword } = item;
    return userWithoutPassword;
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
    
    const { password, ...userWithoutPassword } = result.Item;
    return userWithoutPassword;
  }

  async findById(id: string) {    
    const user = await this.findByEmail(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
