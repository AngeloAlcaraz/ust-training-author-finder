import { IsEmail, IsString, MinLength } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {

    @ApiProperty({description: 'The username of the user', example: 'john_doe'})
    @IsString()
    username: string;

    @ApiProperty({description: 'The password of the user', example: 'securePassword123'})
    @IsString()
    @MinLength(8, {message: 'Password must be at least 8 characters long'})
    password: string;

    @ApiProperty({description: 'The email of the user', example: 'test@example.com'})
    @IsEmail()
    email: string;

    @ApiProperty({description: 'The first name of the user', example: 'John', required: false})
    firstName?: string;

    @ApiProperty({description: 'The last name of the user', example: 'Doe', required: false})
    lastName?: string;

    constructor(username: string, password: string, email: string, firstName?: string, lastName?: string) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}