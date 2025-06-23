import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRefreshTokenDto {
  @ApiProperty({
    example: 'new-refresh-token-123',
    description: 'The new refresh token for the user',
  })
  @IsString()
  refreshToken: string;
}