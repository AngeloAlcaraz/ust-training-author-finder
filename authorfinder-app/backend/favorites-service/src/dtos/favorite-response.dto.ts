import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FavoriteResponseDto {
  @ApiProperty({ example: 'fav123' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'OL18319A' })
  @Expose()
  authorId: string;

  @ApiProperty({ example: 'Mark Twain' })
  @Expose()
  name: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @Expose()
  imageUrl?: string;

  @ApiPropertyOptional({ example: '1835-11-30' })
  @Expose()
  birthDate?: string;

  @ApiPropertyOptional({ example: '1910-04-21' })
  @Expose()
  deathDate?: string;

  @ApiPropertyOptional({ example: 'The Adventures of Tom Sawyer' })
  @Expose()
  topWork?: string;

  @ApiProperty({ example: 'user_123' })
  @Expose()
  addedBy: string;

  @ApiProperty({ example: '2025-06-15T12:34:56.000Z' })
  @Expose()
  addedAt: string;
}
