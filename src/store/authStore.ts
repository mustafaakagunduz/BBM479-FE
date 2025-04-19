// src/store/authStore.ts
import { create } from 'zustand';
import axiosInstance from "@/utils/axiosInstance";

interface User {
    id: number;
    username: string;
    email: string;
    role: {
        name: 'ADMIN' | 'USER';
    };
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setIsLoading: (isLoading: boolean) => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: true,
    setUser: (user) => set({ user }),
    setIsLoading: (isLoading) => set({ isLoading }),
    checkAuth: async () => {
        try {
            set({ isLoading: true });
            const response = await axiosInstance.get('/api/users/me', {
                withCredentials: true
            });
            if (response.status === 200) {
                set({ user: response.data });
            } else {
                set({ user: null });
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            set({ user: null });
        } finally {
            set({ isLoading: false });
        }
    }
}));