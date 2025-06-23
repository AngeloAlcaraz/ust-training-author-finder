import { IsEmail, IsIn, IsNotEmpty, IsString, MinLength } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {

    @ApiProperty({description: 'The full name of the user', example: 'John Doe'})
    @IsString()
    name: string;

    @ApiProperty({description: 'The email of the user', example: 'test@example.com'})
    @IsEmail()
    email: string;

    @ApiProperty({description: 'The password of the user', example: 'securePassword123'})
    @IsString()
    @MinLength(8, {message: 'Password must be at least 8 characters long'})
    password: string;

    @ApiProperty({description: 'The gender of the user', example: "male"})
    @IsString()
    @IsIn(['male', 'female'])
    @IsNotEmpty()
    gender: string;

    constructor(name: string, email: string, password: string, gender: string) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.gender = gender;
    }
}