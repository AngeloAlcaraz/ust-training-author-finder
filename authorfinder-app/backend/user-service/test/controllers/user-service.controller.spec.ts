import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../src/controllers/user.controller';
import { UsersService } from '../../src/services/user.service';
import { CreateUserDto } from '../../src/dtos/create-user.dto';
import { CheckEmailDto } from '../../src/dtos/check-email.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: Partial<Record<keyof UsersService, jest.Mock>>;

  beforeEach(async () => {
    usersService = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });

  describe('healthCheck', () => {
    it('should return success true with message', () => {
      const result = usersController.healthCheck();
      expect(result).toEqual({
        success: true,
        message: 'User service is healthy',
        data: null,
      });
    });
  });

  describe('create', () => {
    it('should call usersService.create and return sanitized user', async () => {
      const createUserDto: CreateUserDto = {
        // completa con las propiedades requeridas para CreateUserDto
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        gender: ''
      };

      const userEntity = {
        _id: '123',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedpassword',
        // otras propiedades que tenga el user
      };

      usersService.create?.mockResolvedValue(userEntity);

      const result = await usersController.create(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('message', 'User created successfully');
      expect(result.data).toMatchObject({
        _id: userEntity._id,
        email: userEntity.email,
        name: userEntity.name,
      });
      // no debe exponer password ni otros datos internos
      expect(result.data).not.toHaveProperty('password');
    });
  });

  describe('getByEmail', () => {
    it('should return true if user exists', async () => {
      const query: CheckEmailDto = { email: 'exists@example.com' };
      usersService.findByEmail?.mockResolvedValue({ id: '1', email: query.email });

      const result = await usersController.getByEmail(query);

      expect(usersService.findByEmail).toHaveBeenCalledWith(query.email);
      expect(result).toEqual({
        success: true,
        message: 'User exists',
        data: true,
      });
    });

    it('should return false if user does not exist', async () => {
      const query: CheckEmailDto = { email: 'notfound@example.com' };
      usersService.findByEmail?.mockResolvedValue(null);

      const result = await usersController.getByEmail(query);

      expect(usersService.findByEmail).toHaveBeenCalledWith(query.email);
      expect(result).toEqual({
        success: true,
        message: 'User does not exist',
        data: false,
      });
    });
  });
});
