import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "src/controllers/auth.controller";
import { AuthService } from "src/services/auth.service";
import { UserService } from "src/services/user.service";
import { AccessTokenStrategy } from "src/strategies/accessToken.strategy";
import { RefreshTokenStrategy } from "src/strategies/refreshToken.strategy";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({ secret: process.env.JWT_ACCESS_SECRET }),
    ],
    controllers: [AuthController],
    providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, UserService],
    exports: [], // Export any providers or modules that need to be used in other modules
})
export class AuthModule {}