// components/RoleBasedLayout.tsx
import {useAuth} from "@/app/hooks/useAuth";
import { redirect } from 'next/navigation';
import Navbar from '@/app/components/navbar/Navbar';
import { CircularProgress } from '@mui/material';
import {UserRole} from "@/app/types/auth";

interface RoleBasedLayoutProps {
    children: React.ReactNode;
    requiredRole?: UserRole;
}

const RoleBasedLayout = ({ children, requiredRole }: RoleBasedLayoutProps) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <CircularProgress />
            </div>
        );
    }

    if (!user) {
        redirect('/login');
    }

    if (requiredRole && user.role.name !== requiredRole) {
        redirect('/unauthorized');
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <Navbar />
            <main className="max-w-screen-xl mx-auto p-4">
                {children}
            </main>
        </div>
    );
};

export default RoleBasedLayout;