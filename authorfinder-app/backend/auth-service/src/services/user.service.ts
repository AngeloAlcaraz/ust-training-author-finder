import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CustomAxiosInstance } from "src/api/CustomAxiosInstance";

@Injectable()
export class UserService {
    private api: CustomAxiosInstance;

    constructor(private readonly configService: ConfigService) {
        this.api = new CustomAxiosInstance(configService.getOrThrow<string>('USER_SERVICE_URL'));
    }

    setTokens(accessToken: string, refreshToken: string) {
        this.api.setAccessToken(accessToken);
        this.api.setRefreshToken(refreshToken);
    }
    
    async createUser(userData: any): Promise<any> {
        const response = await this.api.instance.post("/users", userData);
        return response.data.data; // Axios response structure includes a 'data' field with the original response from the API
    }

    async findByEmail(email: string): Promise<any> {
        const response = await this.api.instance.get(`/users/email?email=${email}`);
        return response.data.data; //Axios response structure includes a 'data' field with the original response from the API
    }

    async update(userId: string, updateData: any): Promise<any> {
        const response = await this.api.instance.patch(`/users/refresh-token/${userId}`, updateData);
        return response.data.data; // Axios response structure includes a 'data' field with the original response from the API
    }
}