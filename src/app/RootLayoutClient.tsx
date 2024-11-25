"use client"
import { usePathname, useRouter } from 'next/navigation'
import Navbar from '@/app/components/navbar/Navbar'
import { Toaster } from 'react-hot-toast'
import { useAuth } from '@/app/surveys/hooks/useAuth'
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

    const noNavbarPages = ['/login', '/register', '/', '/unauthorized']
    const adminPages = ['/admin', '/authorization']
    const userPages = ['/dashboard', '/previousresults', '/applysurvey']

    useEffect(() => {
        if (!loading) {
            if (!user && !noNavbarPages.includes(pathname)) {
                router.push('/login')
                return
            }

            if (user) {
                const isAdminPage = adminPages.some(page => pathname.startsWith(page))
                const isUserPage = userPages.some(page => pathname.startsWith(page))

                if (isAdminPage && user.role.name !== 'ADMIN') {
                    router.push('/unauthorized')
                    return
                }

                if (isUserPage && user.role.name !== 'USER') {
                    router.push('/unauthorized')
                    return
                }
            }
        }
    }, [user, loading, pathname, router])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex justify-center items-center">
                <CircularProgress />
            </div>
        )
    }

    if (noNavbarPages.includes(pathname)) {
        return (
            <div className="relative">
                <PageTransition key={pathname}>{children}</PageTransition>
            </div>
        )
    }

    if (!user) {
        router.push('/login')
        return null
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