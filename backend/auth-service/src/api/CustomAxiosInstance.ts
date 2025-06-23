import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export class CustomAxiosInstance {
  private axiosInstance: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 5000,
    });

    // Request interceptor to add JWT token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;
        // If 401 and refreshToken exists, try to refresh
        if (
          error.response &&
          error.response.status === 401 &&
          this.refreshToken &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            const refreshResponse = await this.axiosInstance.post(
              '/auth/refresh',
              { refreshToken: this.refreshToken }
            );
            this.accessToken = refreshResponse.data.accessToken;
            // Update Authorization header and retry original request
            originalRequest.headers['Authorization'] = `Bearer ${this.accessToken}`;
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            // Handle refresh failure (e.g., logout)
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  setRefreshToken(token: string) {
    this.refreshToken = token;
  }

  get instance(): AxiosInstance {
    return this.axiosInstance;
  }
}