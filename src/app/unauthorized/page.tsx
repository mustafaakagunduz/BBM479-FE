// app/unauthorized/SpiderChart.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Skull } from 'lucide-react'; // Next.js projelerinde lucide-react icons kullanılabilir
import { XOctagon, AlertTriangle, Shield, ShieldOff } from 'lucide-react';

export default function UnauthorizedPage() {
    const router = useRouter();
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="bg-white p-12 rounded-xl shadow-2xl text-center max-w-2xl w-full mx-auto border-2 border-purple-600">
                <div className="flex justify-center mb-6">
                    <ShieldOff className="w-24 h-24 text-purple-600" />
                </div>

                <h1 className="text-4xl font-bold text-purple-600 mb-6">
                    Unauthorized Access
                </h1>

                <div className="space-y-4 mb-8">
                    <p className="text-xl text-gray-700">
                        You don't have permission to access this page.
                    </p>
                    <p className="text-gray-500">
                        Please contact an administrator if you believe this is a mistake.
                    </p>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={() => {
                            router.push(user?.role.name === 'ADMIN' ? '/homepageadmin' : '/homepageuser');
                        }}
                        className="px-8 py-3 bg-purple-600 text-white text-lg rounded-lg
                                hover:bg-purple-700 transform hover:scale-105 transition-all
                                duration-200 shadow-lg hover:shadow-purple-500/50"
                    >
                        Return to Homepage
                    </button>
                </div>

            </div>
        </div>
    );
}