import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Valid email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ example: 'password123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password?: string;

  @ApiProperty({
    example: 'male',
    enum: ['male', 'female'],
    description: 'User gender',
  })
  @IsString()
  @IsIn(['male', 'female'])
  @IsNotEmpty()
  gender: string;

  @ApiHideProperty()
  @IsString()
  @IsOptional()
  refreshToken?: string;
}
