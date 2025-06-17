import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { CheckEmailDto } from '../dtos/check-email.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { plainToInstance } from 'class-transformer';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
    type: UserResponseDto,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const sanitizedUser = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'User created successfully',
      data: sanitizedUser,
    };
  }

  @Get('email')
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
        data: true,
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
      data: !!user,
    };
  }
}
