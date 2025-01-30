'use client';

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserRole } from '../types/auth';
import axios from "axios";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}





interface AuthResponse {
  success: boolean;
  message: string;
  role?: string;
  userId?: number;
  user?: {
    id: number;
    username: string;
    email: string;
    name: string;
    role: {
      name: UserRole;
    };
    profileImage?: string;
    emailVerified?: boolean; // Add this line
  };
}

interface LoginResult {
  success: boolean;
  user: User;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<LoginResult | undefined>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUserData: (userId: number) => Promise<void>;
}

type AuthAction =
    | { type: 'LOGIN_SUCCESS'; payload: User }
    | { type: 'LOGOUT' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'UPDATE_USER'; payload: User };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      if (authData.user) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: authData.user });
      }
    }
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  const updateUserData = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:8081/api/users/${userId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const userData = await response.json();
      console.log('Received user data:', userData); // Debug için

      if (state.user) {
        const updatedUser: User = {
          ...state.user,
          ...userData, // Direkt olarak gelen datayı kullan
        };

        localStorage.setItem('auth', JSON.stringify({ user: updatedUser }));
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };
 // Doğrulama durumunu takip eden state ekle
const [isVerified, setIsVerified] = useState(false);

const login = async (email: string, password: string): Promise<LoginResult | undefined> => {
  try {
    const response = await axios.post<AuthResponse>('http://localhost:8081/api/auth/login', {
      email,
      password
    });

    if (response.data.success && response.data.user) {
      // Explicitly check email verification
      if (!response.data.user.emailVerified) {
        throw new Error('Please verify your email before logging in');
      }

      const userResponse = await axios.get<User>(`http://localhost:8081/api/users/${response.data.user.id}`);
      const userData = userResponse.data;

      const user: User = {
        ...response.data.user,
        profileImage: userData.profileImage
      };

      localStorage.setItem('auth', JSON.stringify({ user }));
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });

      return { success: true, user };
    }
    return undefined;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Invalid credentials';
      // More meaningful error messages
      if (errorMessage.includes('verify')) {
        throw new Error('Please check your email and verify your account');
      }
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred');
  }
};  
  const logout = () => {
    localStorage.removeItem('auth');
    dispatch({ type: 'LOGOUT' });
    setTimeout(() => {
      router.push('/login');
    }, 0);
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  return (
      <AuthContext.Provider value={{ ...state, login, logout, setLoading, updateUserData }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};