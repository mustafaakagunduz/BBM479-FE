// components/guards/UserGuard.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/surveys/hooks/useAuth";
import { CircularProgress } from "@mui/material";

interface UserGuardProps {
    children: React.ReactNode;
}

const UserGuard: React.FC<UserGuardProps> = ({ children }) => {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (user.role.name !== 'USER') {
                router.push('/unauthorized');
            }
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex justify-center items-center">
                <CircularProgress />
            </div>
        );
    }

    if (!user || user.role.name !== 'USER') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
            {children}
        </div>
    );
};

export default UserGuard;