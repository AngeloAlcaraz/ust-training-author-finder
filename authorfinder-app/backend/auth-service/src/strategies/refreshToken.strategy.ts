import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor() {
    super({
        //jwtFromRequest: ExtractJwt.fromBodyField("refreshToken"), // Extract refresh token from the body
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract refresh token from the Authorization header
        //ignoreExpiration: false,
        //secretOrKey: process.env.JWT_REFRESH_SECRET || '', // Use environment variable for the secret
        secretOrKey: "your_jwt_refresh_secret", // Replace with your actual secret or use environment variable
        passReqToCallback: true, // Pass the request to the validate method
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.get("Authorization")?.replace("Bearer ", "").trim(); // Get the refresh token from the Authorization header
    return { ...payload, refreshToken }; // Return the payload to be used in the request
  }
}