// components/guards/AdminGuard.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { CircularProgress } from "@mui/material";

interface AdminGuardProps {
    children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
    const router = useRouter();
    const { user, loading } = useAuth();
    
    useEffect(() => {
        console.log('AdminGuard Auth State:', { user, loading }); // Debug için

        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (user.role.name !== 'ADMIN') {
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

    if (!user || user.role.name !== 'ADMIN') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
            {children}
        </div>
    );
};

export default AdminGuard;