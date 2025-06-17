import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import Joi from "joi";
import { AuthController } from "src/controllers/auth.controller";
import { AuthService } from "src/services/auth.service";
import { UserService } from "src/services/user.service";
import { AccessTokenStrategy } from "src/strategies/accessToken.strategy";
import { RefreshTokenStrategy } from "src/strategies/refreshToken.strategy";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({ secret: process.env.JWT_ACCESS_SECRET }),
        ConfigModule.forRoot({
            isGlobal: true, // Makes the configuration available globally
            ignoreEnvFile: process.env.NODE_ENV === 'production', // Ignore .env file in production
            validationSchema: Joi.object({
                JWT_ACCESS_SECRET: Joi.string().min(10).required(),
                JWT_REFRESH_SECRET: Joi.string().min(10).required(),
                JWT_ACCESS_EXPIRATION_TIME: Joi.string().required(),
                JWT_REFRESH_EXPIRATION_TIME: Joi.string().required(),
                PORT: Joi.number().default(4000),
            }),
            validationOptions: {
                abortEarly: false,  // Do not stop validation on the first error
                allowUnknown: true, // Allow unknown keys in the environment variables
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, UserService],
    exports: [], // Export any providers or modules that need to be used in other modules
})
export class AuthModule {}