import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../src/controllers/user.controller';
import { UserService } from '../../src/services/user.service';
import { CreateUserDto } from '../../src/dtos/create-user.dto';
import { CheckEmailDto } from '../../src/dtos/check-email.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UserService;

  const mockUserService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  describe('healthCheck', () => {
    it('should return service health info', () => {
      const result = controller.healthCheck();
      expect(result).toEqual({
        success: true,
        message: 'User service is healthy',
        data: null,
      });
    });
  });

  describe('create', () => {
    it('should create a new user and return sanitized response', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        gender: 'male',
      };

      const createdUser = {
        userId: createUserDto.email,
        name: createUserDto.name,
        email: createUserDto.email,
        gender: createUserDto.gender,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockUserService.create.mockResolvedValue(createdUser);

      const response = await controller.create(createUserDto);

      expect(userService.create).toHaveBeenCalledWith(createUserDto);
      expect(response).toEqual({
        success: true,
        message: 'User created successfully',
        data: expect.objectContaining({
          _id: undefined, 
          name: 'Test User',
          email: 'test@example.com',
          gender: 'male',
        }),
      });
    });
  });

  describe('getByEmail', () => {
    it('should return success true and data true if user exists', async () => {
      const email = 'exists@example.com';
      const query: CheckEmailDto = { email };

      mockUserService.findByEmail.mockResolvedValue({
        userId: email,
        name: 'Existing User',
        email,
        gender: 'female',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const result = await controller.getByEmail(query);

      expect(userService.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual({
        success: true,
        message: 'User exists',
        data: true,
      });
    });

    it('should return success true and data false if user does not exist', async () => {
      const email = 'notfound@example.com';
      const query: CheckEmailDto = { email };

      mockUserService.findByEmail.mockResolvedValue(null);

      const result = await controller.getByEmail(query);

      expect(userService.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual({
        success: true,
        message: 'User does not exist',
        data: false,
      });
    });
  });
});
