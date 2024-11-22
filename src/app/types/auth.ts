// types/auth.ts
export type UserRole = 'ADMIN' | 'USER';  // Mevcut sisteminizdeki rol isimleriyle eşleştirdim

export interface User {
    id: number;
    username: string;
    email: string;
    role: {
        name: UserRole;
    };
}