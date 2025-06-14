import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from '../../src/services/user.service';
import { User } from '../../src/schemas/user.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let mockModel: any;

  const mockUser = {
    _id: 'userId123',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
    gender: 'male',
  };

  const saveMock = jest.fn().mockResolvedValue(mockUser);

  beforeEach(async () => {
    const modelMock = {
      findOne: jest.fn(),
      findById: jest.fn(),
      prototype: {
        save: saveMock,
      },
    };

    const modelConstructorMock = jest.fn().mockImplementation((dto) => ({
      ...dto,
      save: saveMock,
    }));

    Object.assign(modelConstructorMock, modelMock); // Asignamos los métodos estáticos al constructor

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: modelConstructorMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    mockModel = module.get(getModelToken(User.name));
  });

  describe('create', () => {
    it('should create and save a new user', async () => {
      mockModel.findOne.mockReturnValueOnce({ exec: () => Promise.resolve(null) });

      const createUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'pass',
        gender: 'male',
      };

      const result = await service.create(createUserDto);

      expect(mockModel.findOne).toHaveBeenCalledWith({ email: createUserDto.email });
      expect(mockModel).toHaveBeenCalledWith(createUserDto);
      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should throw BadRequestException if user already exists', async () => {
      mockModel.findOne.mockReturnValueOnce({ exec: () => Promise.resolve(mockUser) });

      const createUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'pass',
        gender: 'male',
      };

      await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
      expect(mockModel.findOne).toHaveBeenCalledWith({ email: createUserDto.email });
    });
  });

  describe('findByEmail', () => {
    it('should return true if user exists', async () => {
      mockModel.findOne.mockReturnValueOnce({ exec: () => Promise.resolve(mockUser) });

      const result = await service.findByEmail('test@example.com');

      expect(result).toBe(true);
      expect(mockModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('should return false if user does not exist', async () => {
      mockModel.findOne.mockReturnValueOnce({ exec: () => Promise.resolve(null) });

      const result = await service.findByEmail('notfound@example.com');

      expect(result).toBe(false);
      expect(mockModel.findOne).toHaveBeenCalledWith({ email: 'notfound@example.com' });
    });
  });

  describe('findById', () => {
    it('should return user if found', async () => {
      mockModel.findById.mockReturnValueOnce({ exec: () => Promise.resolve(mockUser) });

      const result = await service.findById('userId123');

      expect(result).toEqual(mockUser);
      expect(mockModel.findById).toHaveBeenCalledWith('userId123');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockModel.findById.mockReturnValueOnce({ exec: () => Promise.resolve(null) });

      await expect(service.findById('nonexistentId')).rejects.toThrow(NotFoundException);
      expect(mockModel.findById).toHaveBeenCalledWith('nonexistentId');
    });
  });
});
