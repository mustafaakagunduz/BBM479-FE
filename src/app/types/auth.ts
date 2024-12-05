// types/auth.ts
export type UserRole = 'ADMIN' | 'USER';

export interface User {
    id: number;
    username: string;
    email: string;
    name: string; // Eklendi
    role: {
        name: UserRole;
    };
    profileImage?: string;
}