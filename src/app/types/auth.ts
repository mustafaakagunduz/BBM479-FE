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
    profileImage?: string; // Changed to string and made optional
    emailVerified?: boolean;
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