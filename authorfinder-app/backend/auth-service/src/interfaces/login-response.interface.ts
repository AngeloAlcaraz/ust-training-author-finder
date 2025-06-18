export interface ILoginResponse {
    userId: string;
    name: string;
    email: string;
    gender: string;
    accessToken: string;
    refreshToken: string;
}