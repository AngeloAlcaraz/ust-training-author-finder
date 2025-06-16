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
import { CheckEmailDto } from 'src/dtos/check-email.dto';
import { ApiQuery } from '@nestjs/swagger';
import { UserResponseDto } from '../dtos/user-response.dto';
import { plainToInstance } from 'class-transformer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('health')
  healthCheck() {
    return {
      success: true,
      message: 'User service is healthy',
      data: null,
    };
  }

  @Post()
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
  @ApiQuery({
    name: 'email',
    type: String,
    required: true,
    example: 'john@example.com',
    description: 'Email address to check',
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
