// src/store/authStore.ts
import { create } from 'zustand';

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
            const response = await fetch('http://localhost:8081/api/users/me', {
                credentials: 'include'
            });
            if (response.ok) {
                const userData = await response.json();
                set({ user: userData });
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