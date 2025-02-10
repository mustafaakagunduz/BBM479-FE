"use client"
import { usePathname, useRouter } from 'next/navigation'
import Navbar from '@/app/components/navbar/Navbar'
import { Toaster } from 'react-hot-toast'
import { useAuth } from '@/app/context/AuthContext';
import { CircularProgress } from '@mui/material'
import { useEffect } from 'react'
import PageTransition from '@/app/components/PageTransition'

export default function RootLayoutClient({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const pathname = usePathname()
    const router = useRouter()
    const { user, loading } = useAuth()

    const noNavbarPages = ['/login', '/register', '/', '/unauthorized'];
    const adminPages = ['/admin', '/authorization']
    const userPages = ['/dashboard', '/previousresults', '/applysurvey']

    // Helper function to check if the current path should have a navbar
    const isNoNavbarPage = (path: string) => {
        return noNavbarPages.includes(path) || path.startsWith('/reset-password')
    }

    useEffect(() => {
        if (!loading) {
            console.log('Current User:', user);
            console.log('Current Pathname:', pathname);

            // Kullanıcı yoksa ve navbar gerektiren bir sayfadaysa
            if (!user && !isNoNavbarPage(pathname)) {
                router.push('/login');
                return;
            }

            // Kullanıcı varsa yetki kontrolü
            if (user) {
                // Admin spesifik sayfalar
                const isAdminOnlyPage = adminPages.some(page => pathname.startsWith(page)) ||
                    pathname === '/homepageadmin';
                console.log('Is Admin Page:', isAdminOnlyPage);

                // User spesifik sayfalar
                const isUserOnlyPage = userPages.some(page => pathname.startsWith(page)) ||
                    pathname === '/homepageuser';
                console.log('Is User Page:', isUserOnlyPage);

                console.log('User Role:', user.role.name);

                if (user.role.name === 'USER') {
                    console.log('User is trying to access:', pathname);
                }

                // Admin, user sayfasına girmeye çalışırsa
                if (user.role.name === 'ADMIN' && isUserOnlyPage) {
                    router.push('/unauthorized');
                    return;
                }

                // User, admin sayfasına girmeye çalışırsa
                if (user.role.name === 'USER' && isAdminOnlyPage) {
                    router.push('/unauthorized');
                    return;
                }

                // Her kullanıcıyı kendi anasayfasına yönlendir
                if (pathname === '/') {
                    const destination = user.role.name === 'ADMIN' ? '/homepageadmin' : '/homepageuser';
                    console.log('Redirecting to:', destination);
                    router.push(destination);
                    return;
                }
            }
        }
    }, [user, loading, pathname, router]);

    // Loading durumu
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex justify-center items-center">
                <CircularProgress />
            </div>
        )
    }

    // Navbar'sız sayfalar için render
    if (isNoNavbarPage(pathname)) {
        return (
            <div className="relative">
                <PageTransition key={pathname}>{children}</PageTransition>
            </div>
        )
    }

    // Kullanıcı girişi kontrolü ve ana layout render
    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex justify-center items-center">
                <CircularProgress />
            </div>
        )
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                <div className="relative">
                    <PageTransition key={pathname}>{children}</PageTransition>
                </div>
            </main>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 2000,
                    style: {
                        background: '#ECFDF5',
                        color: '#059669',
                        border: '1px solid #10B981',
                        padding: '16px',
                        fontSize: '1.1rem',
                    },
                }}
            />
        </>
    )
}