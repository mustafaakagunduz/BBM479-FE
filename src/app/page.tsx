// src/app/page.tsx
'use client';
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from '@/store/authStore';
import { CircularProgress } from '@mui/material';

const Home: React.FC = () => {
    const router = useRouter();
    const { user, isLoading, checkAuth } = useAuthStore();

    useEffect(() => {
        const initializeAuth = async () => {
            await checkAuth();
            if (!isLoading) {
                if (user) {
                    router.push(user.role.name === 'ADMIN' ? '/homepageadmin' : '/homepageuser');
                } else {
                    router.push('/login');
                }
            }
        };

        initializeAuth();
    }, [checkAuth, isLoading, router, user]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex justify-center items-center">
            <CircularProgress />
        </div>
    );
};

export default Home;