// types/auth.ts
export type UserRole = 'ADMIN' | 'USER' | 'MODERATOR';

// Interface for the user object
export interface User {
    id: number;
    username: string;
    email: string;
    name: string;
    role: {
        name: UserRole;
    };
    profileImage?: string;
    emailVerified?: boolean;
    company?: {
        id: number;
        name: string;
    };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    username: string;
    email: string;
    role: {
      name: UserRole;
    };
    emailVerified: boolean;
  };
}