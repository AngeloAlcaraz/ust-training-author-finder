import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(private readonly configService: ConfigService) {
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract refresh token from the Authorization header
        secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        passReqToCallback: true, // Pass the request to the validate method
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.get("Authorization")?.replace("Bearer ", "").trim(); // Get the refresh token from the Authorization header
    return { ...payload, refreshToken }; // Return the payload to be used in the request
  }
}