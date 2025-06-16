export interface LoginResponse {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    accessToken: string;
    refreshToken: string;
}