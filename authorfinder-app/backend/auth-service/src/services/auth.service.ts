import { BadRequestException, Injectable } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { Tokens } from "src/types/tokens.type";
import { CreateUserDto } from "src/dtos/create-user.dto";
import { LoginResponse } from "src/interfaces/res.login.interface";
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

    private async getTokens(userId: string, username: string): Promise<Tokens> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    username,
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

    async signUp(createUserDto: CreateUserDto): Promise<LoginResponse> {
        const userExists = await this.userService.findByEmail(createUserDto.email);
        if (userExists) {
            throw new BadRequestException("User already exists");
        }

        const hashedPassword = await this.hashPassword(createUserDto.password);
        const newUser = await this.userService.create({
            ...createUserDto,
            password: hashedPassword,
        });

        const tokens = await this.getTokens(newUser.id, newUser.username);
        await this.updateRefreshToken(newUser.id, tokens.refreshToken);

        return {
            ...tokens,
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
        };
    }

    async signIn(data: AuthDto): Promise<LoginResponse> {
        const user = await this.userService.findByEmail(data.email);
        if (!user || !(await argon2.verify(user.password, data.password))) {
            throw new BadRequestException("Invalid credentials");
        }

        const tokens = await this.getTokens(user.id, user.username);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return {
            ...tokens,
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        };
    }

    async logout(userId: string): Promise<void> {
        const user = await this.userService.findByEmail(userId);
        if (!user) {
            throw new BadRequestException("User not found");
        }

        await this.userService.update(user.id, { refreshToken: null });
    }

    async refreshTokens(userId: string, refreshToken: string): Promise<LoginResponse> {
        const user = await this.userService.findByEmail(userId);
        if (!user || !user.refreshToken) {
            throw new BadRequestException("User not found or no refresh token");
        }

        const isRefreshTokenValid = await argon2.verify(user.refreshToken, refreshToken);
        if (!isRefreshTokenValid) {
            throw new BadRequestException("Invalid refresh token");
        }

        const tokens = await this.getTokens(user.id, user.username);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return {
            ...tokens,
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        }
    }
}