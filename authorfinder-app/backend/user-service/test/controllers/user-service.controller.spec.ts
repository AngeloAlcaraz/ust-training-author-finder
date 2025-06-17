import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../src/controllers/user.controller';
import { UserService } from '../../src/services/user.service';
import { CreateUserDto } from '../../src/dtos/create-user.dto';
import { CheckEmailDto } from '../../src/dtos/check-email.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
            updateRefreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get(UserService);
  });

  describe('healthCheck', () => {
    it('should return service health status', () => {
      const result = controller.healthCheck();
      expect(result).toEqual({
        success: true,
        message: 'User service is healthy',
        data: null,
      });
    });
  });

  describe('create', () => {
    it('should create a new user and return sanitized user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'pass123',
        gender: 'male',
        refreshToken: undefined,
      };
      const createdUser = {
        ...createUserDto,
        userId: createUserDto.email,
        createdAt: '2025-06-17T12:00:00Z',
        updatedAt: '2025-06-17T12:00:00Z',
        password: 'pass123',
        refreshToken: null,
      };

      userService.create.mockResolvedValue(createdUser);

      const result = await controller.create(createUserDto);

      expect(userService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toMatchObject({
        success: true,
        message: 'User created successfully',
        data: expect.objectContaining({
          userId: createUserDto.email,
          email: createUserDto.email,
          name: createUserDto.name,
        }),
      });

      expect(
        result.data.refreshToken === null || result.data.refreshToken === undefined,
      ).toBe(true);
    });
  });

  describe('getByEmail', () => {
    it('should return user if exists', async () => {
      const email = 'existing@example.com';
      const user = {
        userId: email,
        name: 'Existing User',
        email,
        gender: 'female',
        password: 'hashed_password',
        createdAt: '2025-06-17T12:00:00Z',
        updatedAt: '2025-06-17T12:00:00Z',
        refreshToken: null,
      };
      userService.findByEmail.mockResolvedValue(user);

      const query: CheckEmailDto = { email };
      const result = await controller.getByEmail(query);

      expect(userService.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual({
        success: true,
        message: 'User exists',
        data: user,
      });
    });

    it('should return user does not exist if user not found', async () => {
      const email = 'notfound@example.com';
      userService.findByEmail.mockResolvedValue(null);

      const query: CheckEmailDto = { email };
      const result = await controller.getByEmail(query);

      expect(userService.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual({
        success: true,
        message: 'User does not exist',
        data: null,
      });
    });
  });

  describe('updateRefreshToken', () => {
    it('should update refresh token and return success true', async () => {
      const userId = 'user-id-123';
      const dto = { refreshToken: 'new-refresh-token-abc' };

      userService.updateRefreshToken.mockResolvedValue(true);

      const result = await controller.updateRefreshToken(userId, dto);

      expect(userService.updateRefreshToken).toHaveBeenCalledWith(userId, dto.refreshToken);
      expect(result).toEqual({
        success: true,
        message: 'Refresh token updated successfully',
        data: true,
      });
    });
  });
});
