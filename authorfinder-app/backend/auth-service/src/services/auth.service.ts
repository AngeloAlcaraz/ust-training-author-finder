import { BadRequestException, Injectable } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { Tokens } from "src/types/tokens.type";
import { CreateUserDto } from "src/dtos/create-user.dto";
import { ILoginResponse } from "src/interfaces/login-response.interface";
import { AuthDto } from "src/dtos/auth.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    private async hashPassword(password: string): Promise<string> {
        return await argon2.hash(password);
    }

    private async getTokens(userId: string, username: string, email: string): Promise<Tokens> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    username,
                    email,
                },
                {
                    secret: process.env.JWT_ACCESS_SECRET || '',
                    expiresIn: "15m", // Access token expiration time
                }
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    username,
                    email,
                },
                {
                    secret: process.env.JWT_REFRESH_SECRET || '',
                    expiresIn: "7d", // Refresh token expiration time
                }
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    private async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
        const hashedRefreshToken = await this.hashPassword(refreshToken);
        await this.userService.update(userId, {refreshToken: hashedRefreshToken});
    }

    async signUp(createUserDto: CreateUserDto): Promise<ILoginResponse> {
        const userExists = await this.userService.findByEmail(createUserDto.email);
        if (userExists) {
            throw new BadRequestException("User already exists");
        }

        const hashedPassword = await this.hashPassword(createUserDto.password);
        const newUser = await this.userService.createUser({
            ...createUserDto,
            password: hashedPassword,
        });

        const tokens = await this.getTokens(newUser.userId, newUser.name, newUser.email);
        await this.updateRefreshToken(newUser.userId, tokens.refreshToken);

        return {
            userId: newUser.userId,
            name: newUser.name,
            email: newUser.email,
            gender: newUser.gender,
            ...tokens,
        };
    }

    async signIn(data: AuthDto): Promise<ILoginResponse> {
        const user = await this.userService.findByEmail(data.email);
        if (!user || !(await argon2.verify(user.password, data.password))) {
            throw new BadRequestException("Invalid credentials");
        }
        
        const tokens = await this.getTokens(user.userId, user.name, user.email);
        await this.updateRefreshToken(user.userId, tokens.refreshToken);

        return {
            ...tokens,
            userId: user.userId,
            name: user.name,
            email: user.email,
            gender: user.gender
        };
    }

    async logout(userId: string): Promise<void> {
        await this.userService.update(userId, { refreshToken: '' });
    }

    async refreshTokens(email: string, refreshToken: string): Promise<ILoginResponse> {
        const user = await this.userService.findByEmail(email);
        if (!user || !user.refreshToken) {
            throw new BadRequestException("User not found or no refresh token");
        }

        const isRefreshTokenValid = await argon2.verify(user.refreshToken, refreshToken);
        if (!isRefreshTokenValid) {
            throw new BadRequestException("Invalid refresh token");
        }

        const tokens = await this.getTokens(user.userId, user.name, user.email);
        await this.updateRefreshToken(user.userId, tokens.refreshToken);

        return {
            ...tokens,
            userId: user.userId,
            name: user.name,
            email: user.email,
            gender: user.gender,
        }
    }
}