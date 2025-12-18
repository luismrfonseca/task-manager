import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { UserDTO } from '@shared/index';

interface AuthState {
    user: UserDTO | null;
    isAuthenticated: boolean;
    login: (user: UserDTO, accessToken: string, refreshToken: string) => Promise<void>;
    logout: () => Promise<void>;
    loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,

    login: async (user, accessToken, refreshToken) => {
        await SecureStore.setItemAsync('access_token', accessToken);
        await SecureStore.setItemAsync('refresh_token', refreshToken);
        // In a real app we might decode token or store user object in local storage too
        // For now we assume user object is passed
        set({ user, isAuthenticated: true });
    },

    logout: async () => {
        await SecureStore.deleteItemAsync('access_token');
        await SecureStore.deleteItemAsync('refresh_token');
        set({ user: null, isAuthenticated: false });
    },

    loadUser: async () => {
        // Logic to load user from token or API if needed
        // For now just check if token exists
        const token = await SecureStore.getItemAsync('access_token');
        if (token) {
            set({ isAuthenticated: true });
        }
    }
}));
