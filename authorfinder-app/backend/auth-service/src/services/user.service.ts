import { Injectable } from "@nestjs/common";
import { CustomAxiosInstance } from "src/api/CustomAxiosInstance";

@Injectable()
export class UserService {
    private api: CustomAxiosInstance;

    constructor() {
        this.api = new CustomAxiosInstance("http://localhost:4001/api/v1");
    }

    setTokens(accessToken: string, refreshToken: string) {
        this.api.setAccessToken(accessToken);
        this.api.setRefreshToken(refreshToken);
    }
    
    async createUser(userData: any): Promise<any> {
        const response = await this.api.instance.post("/users", userData);
        return response.data.data;
    }

    async findByEmail(email: string): Promise<any> {
        const response = await this.api.instance.get(`/users/email?email=${email}`);
        return response.data.data; //Axios response structure includes a 'data' field with the original response from the API
    }

    async update(userId: string, updateData: any): Promise<any> {
        // const response = await this.api.instance.put(`/users/${userId}`, updateData);
        // return response.data;
        
        return { 
            id: 'newUserId', 
            name: 'newUsername',
            email: 'test@example.com',
            gender: 'male',
            refreshToken: 'newRefreshToken',

        }; // Mock response for testing
    }
}