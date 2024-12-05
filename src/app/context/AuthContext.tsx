'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserRole } from '../types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
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
      dispatch({ type: 'LOGIN_SUCCESS', payload: authData.user });
    }
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  const updateUserData = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:8081/api/users/${userId}`);
      const userData = await response.json();

      if (state.user) {
        const updatedUser = {
          ...state.user,
          profileImage: userData.profileImage
        };

        localStorage.setItem('auth', JSON.stringify({ user: updatedUser }));
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const login = async (email: string, password: string): Promise<LoginResult | undefined> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.success) {
        const user: User = {
          id: data.userId,
          username: email.split('@')[0],
          email: email,
          role: {
            name: data.role as UserRole
          }
        };

        localStorage.setItem('auth', JSON.stringify({ user }));
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        return { success: true, user };
      }
      return undefined;
    } catch (error) {
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
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