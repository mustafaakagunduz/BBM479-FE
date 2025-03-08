'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from '@/store/authStore';
import { CircularProgress } from '@mui/material';

const Home: React.FC = () => {
    const router = useRouter();
    const { user, isLoading, checkAuth } = useAuthStore();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                await checkAuth();

                if (!user && !isLoading) {
                    setIsRedirecting(true);
                    router.push('/login');
                } else if (user && !isLoading) {
                    setIsRedirecting(true);
                    router.push(user.role.name === 'ADMIN' ? '/homepageadmin' : '/homepageuser');
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
                setIsRedirecting(true);
                router.push('/login');
            }
        };

        if (!isRedirecting) {
            initializeAuth();
        }
    }, [checkAuth, isLoading, router, user, isRedirecting]);

    // Force router refresh after component mounts
    useEffect(() => {
        // This ensures the router is fully initialized
        const timeout = setTimeout(() => {
            if (user && !isRedirecting && !isLoading) {
                setIsRedirecting(true);
                router.refresh();
                router.push(user.role.name === 'ADMIN' ? '/homepageadmin' : '/homepageuser');
            } else if (!user && !isRedirecting && !isLoading) {
                setIsRedirecting(true);
                router.refresh();
                router.push('/login');
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [router, user, isRedirecting, isLoading]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex justify-center items-center flex-col">
            <CircularProgress />
            <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
    );
};

export default Home;