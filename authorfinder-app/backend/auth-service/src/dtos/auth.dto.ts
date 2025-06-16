import { IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AuthDto {

    @ApiProperty({ example: 'test@example.com', description: 'The email of the user' })
    @IsString()
    email: string;

    @ApiProperty({ example: 'securePassword123', description: 'The password of the user' })
    @IsString()
    password: string;
}