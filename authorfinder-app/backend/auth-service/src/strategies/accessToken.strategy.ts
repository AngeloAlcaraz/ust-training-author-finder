import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

type JwtPayload = {
  sub: string; // User ID
  username: string; // Username
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt-access") {
  constructor() {

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      //secretOrKey: process.env.JWT_ACCESS_SECRET || '', // Use environment variable for the secret
      secretOrKey: "your_jwt_access_secret", // Replace with your actual secret or use environment variable
    });
  }

  async validate(payload: JwtPayload) {
    // Here you can add additional validation logic if needed
    return payload; // Return the payload to be used in the request
  }
}