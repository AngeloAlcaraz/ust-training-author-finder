import {
  IsString,
  IsArray,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFavoriteDto {
  @ApiProperty({ example: 'OL18319A' })
  @IsString()
  authorId: string;

  @ApiProperty({ example: 'Mark Twain' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: ['Samuel Langhorne Clemens', 'S.L. Clemens'] })
  @IsArray()
  @IsOptional()
  alternateNames?: string[];

  @ApiPropertyOptional({ example: '1835-11-30' })
  @IsString()
  @IsOptional()
  birthDate?: string;

  @ApiPropertyOptional({ example: '1910-04-21' })
  @IsString()
  @IsOptional()
  deathDate?: string;

  @ApiPropertyOptional({ example: 'The Adventures of Tom Sawyer' })
  @IsString()
  @IsOptional()
  topWork?: string;

  @ApiPropertyOptional({ example: ['American literature', 'Humorists, American'] })
  @IsArray()
  @IsOptional()
  topSubjects?: string[];

  @ApiPropertyOptional({ example: 42 })
  @IsNumber()
  @IsOptional()
  workCount?: number;

  @ApiPropertyOptional({ example: 4.5 })
  @IsNumber()
  @IsOptional()
  ratingsAverage?: number;

  @ApiPropertyOptional({ example: 1234 })
  @IsNumber()
  @IsOptional()
  ratingsCount?: number;

  @ApiProperty({ example: 'user_123' })
  @IsString()
  addedBy: string;

  @ApiProperty({ example: '2025-06-15T12:34:56.000Z' })
  @IsDateString()
  addedAt: string;
}
