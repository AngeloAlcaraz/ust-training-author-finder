import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

import { ddbDocClient } from '../../src/common/aws/dynamodb-client';
import { UserService } from '../../src/services/user.service';
import { CreateUserDto } from '../../src/dtos/create-user.dto';

const mockUser = {
  userId: 'test@example.com',
  name: 'Test User',
  email: 'test@example.com',
  gender: 'male',
  password: 'hashedpassword',
  createdAt: '2025-06-17T00:44:55.248Z',
  updatedAt: '2025-06-17T00:44:55.248Z',
};

const mockUserWithoutPassword = {
  userId: 'test@example.com',
  name: 'Test User',
  email: 'test@example.com',
  gender: 'male',
  createdAt: '2025-06-17T00:44:55.248Z',
  updatedAt: '2025-06-17T00:44:55.248Z',
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    jest.spyOn(ddbDocClient, 'send').mockImplementation(async (command) => {
      if (command instanceof GetCommand) {
        const email = command.input.Key?.userId;
        if (email === 'test@example.com') {
          return { Item: mockUser };
        }
        return { Item: undefined };
      }
      if (command instanceof PutCommand) {
        return {};
      }
      throw new Error('Unknown command');
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should return user object if user exists (no check on password)', async () => {
      const result = await service.findByEmail('test@example.com');
      
      expect(result).toMatchObject({
        userId: mockUser.userId,
        name: mockUser.name,
        email: mockUser.email,
        gender: mockUser.gender,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
      expect(ddbDocClient.send).toHaveBeenCalledWith(expect.any(GetCommand));
    });

    it('should return null if user does not exist', async () => {
      const result = await service.findByEmail('notfound@example.com');
      expect(result).toBeNull();
      expect(ddbDocClient.send).toHaveBeenCalledWith(expect.any(GetCommand));
    });
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      name: 'New User',
      email: 'new@example.com',
      password: 'newpassword',
      gender: 'female',
    };

    it('should create and return a new user without explicitly checking password', async () => {
      (ddbDocClient.send as jest.Mock).mockImplementationOnce(async (command) => {
        if (command instanceof GetCommand) {
          return { Item: undefined }; // No existe usuario
        }
        if (command instanceof PutCommand) {
          return {};
        }
        throw new Error('Unknown command');
      });

      const result = await service.create(createUserDto);

      expect(result).toMatchObject({
        userId: createUserDto.email,
        name: createUserDto.name,
        email: createUserDto.email,
        gender: createUserDto.gender,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      expect(ddbDocClient.send).toHaveBeenCalledWith(expect.any(GetCommand));
      expect(ddbDocClient.send).toHaveBeenCalledWith(expect.any(PutCommand));
    });

    it('should throw BadRequestException if user with email already exists', async () => {
      await expect(
        service.create({
          name: 'Test User',
          email: 'test@example.com',
          password: 'pass',
          gender: 'male',
        }),
      ).rejects.toThrow(BadRequestException);

      expect(ddbDocClient.send).toHaveBeenCalledWith(expect.any(GetCommand));
      expect(ddbDocClient.send).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException if PutCommand conditional check fails', async () => {
      (ddbDocClient.send as jest.Mock)
        .mockImplementationOnce(async (command) => {
          if (command instanceof GetCommand) {
            return { Item: undefined };
          }
          throw new Error('Unexpected command');
        })
        .mockImplementationOnce(async (command) => {
          if (command instanceof PutCommand) {
            const error = new Error();
            (error as any).name = 'ConditionalCheckFailedException';
            throw error;
          }
          throw new Error('Unexpected command');
        });

      await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);

      expect(ddbDocClient.send).toHaveBeenCalledWith(expect.any(GetCommand));
      expect(ddbDocClient.send).toHaveBeenCalledWith(expect.any(PutCommand));
    });
  });

  describe('findById', () => {
    it('should return user if found (no check on password)', async () => {
      const user = await service.findById('test@example.com');

      expect(user).toMatchObject({
        userId: mockUser.userId,
        name: mockUser.name,
        email: mockUser.email,
        gender: mockUser.gender,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
      expect(ddbDocClient.send).toHaveBeenCalledWith(expect.any(GetCommand));
    });

    it('should throw NotFoundException if user not found', async () => {
      (ddbDocClient.send as jest.Mock).mockImplementationOnce(async () => ({ Item: undefined }));

      await expect(service.findById('nonexistentId')).rejects.toThrow(NotFoundException);
      expect(ddbDocClient.send).toHaveBeenCalledWith(expect.any(GetCommand));
    });
  });
});
