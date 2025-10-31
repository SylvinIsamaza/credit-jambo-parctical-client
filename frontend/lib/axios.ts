import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getCookie, setCookie, deleteCookie } from './cookies';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Public axios instance
export const publicApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 1000000,
});

// Protected axios instance
export const protectedApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 1000000,
});

// Request interceptor for protected API
protectedApi.interceptors.request.use(
  (config) => {
    const token = getCookie('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for automatic token refresh
protectedApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = getCookie('refreshToken');
    console.log(error.response.data.message)

    if (error.response.data.message=="Access token required"&&refreshToken) {
      originalRequest._retry = true;

      try {
        const refreshToken = getCookie('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await publicApi.post('/auth/refresh-token', {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        setCookie('accessToken', accessToken, 0.01); // 15 minutes
        setCookie('refreshToken', newRefreshToken, 7); // 7 days

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return protectedApi(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        deleteCookie('accessToken');
        deleteCookie('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);