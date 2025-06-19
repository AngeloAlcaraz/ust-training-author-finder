export interface IAuth {
  message: string;
  data: {
    id: string;
    email: string;
    name: string;
    accessToken: string;
    refreshToken: string;
  };
}
