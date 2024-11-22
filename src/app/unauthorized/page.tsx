// app/unauthorized/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/surveys/hooks/useAuth';

export default function UnauthorizedPage() {
    const router = useRouter();
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">
                    Unauthorized Access
                </h1>
                <p className="text-gray-600 mb-6">
                    You don't have permission to access this page.
                </p>
                <button
                    onClick={() => {
                        router.push(user?.role.name === 'ADMIN' ? '/admin' : '/dashboard');
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                >
                    Go to Homepage
                </button>
            </div>
        </div>
    );
}