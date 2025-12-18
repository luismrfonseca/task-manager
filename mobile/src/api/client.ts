import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '../stores/authStore';

const api = axios.create({
    baseURL: 'http://192.168.1.184:3000', // Update with actual IP for real device
});

// 1. Request Interceptor: Attach the token to every outgoing request
api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Variables to manage the refresh state
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// 2. Response Interceptor: Handle 401 Unauthorized errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            return new Promise(async (resolve, reject) => {
                try {
                    const refreshToken = await SecureStore.getItemAsync('refresh_token');
                    if (!refreshToken) throw new Error('No refresh token available');

                    const res = await axios.post('http://localhost:3000/auth/refresh', {
                        refresh_token: refreshToken,
                    });

                    const { access_token, refresh_token: newRefreshToken } = res.data;
                    await SecureStore.setItemAsync('access_token', access_token);
                    await SecureStore.setItemAsync('refresh_token', newRefreshToken);

                    processQueue(null, access_token);

                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    resolve(api(originalRequest));
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    useAuthStore.getState().logout();
                    reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            });
        }

        return Promise.reject(error);
    }
);

export default api;
