import {
  IsString,
  IsOptional,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFavoriteDto {
  @ApiProperty({ example: 'OL18319A' })
  @IsString()
  @IsNotEmpty({ message: 'authorId is required' })
  authorId: string;

  @ApiProperty({ example: 'Mark Twain' })
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: '1835-11-30' })
  @IsString()
  @IsNotEmpty({ message: 'birthDate is required' })
  birthDate: string;

  @ApiPropertyOptional({ example: '1910-04-21' })
  @IsString()
  @IsOptional()
  deathDate?: string;

  @ApiPropertyOptional({ example: 'The Adventures of Tom Sawyer' })
  @IsString()
  @IsOptional()
  topWork?: string;

  @ApiProperty({ example: 'user_123' })
  @IsString()
  @IsNotEmpty({ message: 'addedBy is required' })
  addedBy: string;

  @ApiProperty({ example: '2025-06-15T12:34:56.000Z' })
  @IsDateString()
  @IsNotEmpty({ message: 'addedAt is required' })
  addedAt: string;
}
