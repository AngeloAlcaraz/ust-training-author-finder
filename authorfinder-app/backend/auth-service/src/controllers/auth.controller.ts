import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthUser } from "src/decorator/decorator.auth_user";
import { AuthDto } from "src/dtos/auth.dto";
import { CreateUserDto } from "src/dtos/create-user.dto";
import { AuthService } from "src/services/auth.service";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post("signup")
    @ApiOperation({ summary: "User Registration" })
    @ApiCreatedResponse({ description: "User successfully registered" })
    @ApiBadRequestResponse({ description: "Invalid input data" })
    async signup(@Body() createUserDto: CreateUserDto): Promise<{ message: string, data: any }> {
        const newUser = await this.authService.signUp(createUserDto);
        return { message: "User successfully registered", data: newUser };
    }

    @Post("signin")
    @ApiOperation({ summary: "User Login" })
    @ApiOkResponse({ description: "User successfully logged in" })
    @ApiBadRequestResponse({ description: "Invalid credentials" })
    async signin(@Body() data: AuthDto): Promise<{ message: string, data: any }> {
        const user = await this.authService.signIn(data);
        return { message: "User successfully logged in", data: user };
    }

    @Get("logout")
    @ApiOperation({ summary: "User Logout" })
    @ApiOkResponse({ description: "User successfully logged out" })
    @ApiBadRequestResponse({ description: "Logout failed" })
    async logout(@AuthUser('sub') sub: string): Promise<{ message: string }> {
        await this.authService.logout(sub); // Assuming the user ID is managed in the service
        return { message: "User successfully logged out" };
    }

    @Get("refresh")
    @ApiOperation({ summary: "Refresh User Session" })
    @ApiOkResponse({ description: "User session successfully refreshed" })
    @ApiBadRequestResponse({ description: "Refresh failed" })
    async refreshToken(
        @AuthUser('sub') sub: string,
        @AuthUser('refreshToken') refreshToken: string
    ) {
        const newToken = await this.authService.refreshTokens(sub, refreshToken);
        return { message: "User session successfully refreshed", data: newToken };
    }
}