// types/auth.ts
export type UserRole = 'ADMIN' | 'USER';

export interface User {
    id: number;
    username: string;
    email: string;
    role: {
        name: UserRole;
    };
    profileImage?: string; // Add this
}