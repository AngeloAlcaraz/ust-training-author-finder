import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  ValidationPipe,
  Patch,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CheckEmailDto } from '../dtos/check-email.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { plainToInstance } from 'class-transformer';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UpdateRefreshTokenDto } from 'src/dtos/refresh-token-response-dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) { }

  @Get('health')
  @ApiOperation({ summary: 'Health check for the users service' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  healthCheck() {
    return {
      success: true,
      message: 'User service is healthy',
      data: null,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      example: {
        success: true,
        message: 'User created successfully',
        data: {
          userId: 'abc123',
          name: 'John Doe',
          email: 'john@example.com',
          gender: 'male',
          password: 'hashed_password',
          createdAt: '2025-06-17T12:34:56.789Z',
          updatedAt: '2025-06-17T12:34:56.789Z',
          refreshToken: null,
        },
      },
    },
  })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const sanitizedUser = plainToInstance(UserResponseDto, user);

    return {
      success: true,
      message: 'User created successfully',
      data: sanitizedUser,
    };
  }

  @Get(':email')
  @ApiOperation({ summary: 'Check if a user exists by email' })
  @ApiQuery({
    name: 'email',
    type: String,
    required: true,
    example: 'john@example.com',
    description: 'Email address to check',
  })
  @ApiResponse({
    status: 200,
    description: 'Email existence check result',
    schema: {
      example: {
        success: true,
        message: 'User exists',
        data: {
          userId: 'john@example.com',
          name: 'John Doe',
          email: 'john@example.com',
          gender: 'male',
          password: 'hashed_password',
          createdAt: '2025-06-17T12:34:56.789Z',
          updatedAt: '2025-06-17T12:34:56.789Z',
          refreshToken: null,
        },
      },
    },
  })
  async getByEmail(
    @Query(new ValidationPipe({ transform: true })) query: CheckEmailDto,
  ) {
    const user = await this.usersService.findByEmail(query.email);

    return {
      success: true,
      message: user ? 'User exists' : 'User does not exist',
      data: user,
    };
  }

  @Patch('refresh-token/:userId')
  @ApiOperation({ summary: 'Update only the refresh token for the user' })
  @ApiResponse({
    status: 200,
    description: 'Refresh token updated successfully',
    schema: {
      example: { success: true, message: 'Refresh token updated successfully', data: true },
    },
  })
  @ApiBody({ type: UpdateRefreshTokenDto })
  async updateRefreshToken(
    @Param('userId') userId: string,
    @Body() body: UpdateRefreshTokenDto,
  ) {
    const success = await this.usersService.updateRefreshToken(userId, body.refreshToken);

    return {
      success: true,
      message: 'Refresh token updated successfully',
      data: success,
    };
  }
}
