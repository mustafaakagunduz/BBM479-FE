import { useState, useEffect } from 'react';
import { User } from '@/app/types/auth';

// Mock kullanıcı verisi (template object without accessing localStorage directly)
const MOCK_USER_TEMPLATE = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    role: { name: 'ADMIN' }, // Default role, will be updated later
};

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Development için rol değiştirme fonksiyonu
    const switchRole = () => {
        if (process.env.NODE_ENV === 'development' && user) {
            const newRole = user.role.name === 'ADMIN' ? 'USER' : 'ADMIN';
            localStorage.setItem('mockUserRole', newRole);
            setUser({
                ...user,
                role: { name: newRole as 'ADMIN' | 'USER' },
            });
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Development modunda mock data kullan
                if (process.env.NODE_ENV === 'development') {
                    const savedRole = typeof window !== 'undefined' && localStorage.getItem('mockUserRole') || 'ADMIN';
                    setUser({
                        ...MOCK_USER_TEMPLATE,
                        role: { name: savedRole as 'ADMIN' | 'USER' },
                    });
                    setLoading(false);
                    return;
                }

                // Production'da gerçek API çağrısı yap
                const response = await fetch('http://localhost:8081/api/users/me');
                if (!response.ok) throw new Error('Auth failed');
                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error('Auth error:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    return { user, loading, switchRole };
};
