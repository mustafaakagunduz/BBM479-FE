// components/Navbar.tsx
import Link from 'next/link';
import { useAuth } from '@/app/surveys/hooks/useAuth';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const { user, switchRole } = useAuth();
    const router = useRouter();

    const navigationLinks = {
        ADMIN: [
            { href: '/homepageadmin', label: 'Admin Panel' }
        ],
        USER: [
            { href: '/previousresults', label: 'My Previous Results' },
            { href: '/applysurvey', label: 'View the Surveys' }
        ]
    };

    const currentLinks = user?.role.name === 'ADMIN' ? navigationLinks.ADMIN : navigationLinks.USER;
    const homeLink = user?.role.name === 'ADMIN' ? '/homepageadmin' : '/homepageuser';

    const handleRoleSwitch = () => {
        switchRole();
        // Rol değişiminden sonra ilgili anasayfaya yönlendir
        const newRole = user?.role.name === 'ADMIN' ? 'USER' : 'ADMIN';
        const newHomePage = newRole === 'ADMIN' ? '/homepageadmin' : '/homepageuser';
        router.push(newHomePage);
    };

    return (
        <nav className="bg-purple-600 shadow-md p-4 w-full">
            <div className="flex items-center justify-between max-w-screen-xl mx-auto">
                {/* Logo ve Ana Sayfa Linki */}
                <Link
                    href={homeLink}
                    className="text-xl font-bold text-white hover:text-purple-200 transition-colors duration-200"
                >
                    DX-HRSAM
                </Link>

                {/* Navigasyon Linkleri */}
                <div className="flex-grow text-center space-x-4">
                    {currentLinks.map((link) => (
                        <Link key={link.href} href={link.href}>
                            <button className="px-4 py-2 rounded-lg bg-white text-purple-600 hover:bg-purple-100 transition-all duration-200 shadow-sm hover:shadow-md">
                                {link.label}
                            </button>
                        </Link>
                    ))}
                </div>

                {/* Sağ Taraf Butonları */}
                <div className="flex items-center space-x-3">
                    {/* Development modunda rol değiştirme butonu */}
                    {process.env.NODE_ENV === 'development' && (
                        <button
                            onClick={handleRoleSwitch}
                            className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center"
                        >
                            <span className="mr-2">Switch to</span>
                            <span className="font-semibold">
                                {user?.role.name === 'ADMIN' ? 'USER' : 'ADMIN'}
                            </span>
                        </button>
                    )}

                    {/* Kullanıcı Bilgisi */}
                    <div className="text-white px-4 py-2">
                        <span className="opacity-75 mr-2">Logged in as:</span>
                        <span className="font-semibold">{user?.role.name}</span>
                    </div>

                    {/* Logout Butonu */}
                    <Link href="/login">
                        <button className="px-4 py-2 rounded-lg border-2 border-white text-white hover:bg-white hover:text-purple-600 transition-all duration-200 shadow-sm hover:shadow-md">
                            Logout
                        </button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;