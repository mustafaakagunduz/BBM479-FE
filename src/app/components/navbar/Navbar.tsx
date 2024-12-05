import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import {
    ChevronDown,
    Building2,
    Lightbulb,
    UserCircle,
    ClipboardList,
    Shield,
    ChevronRight,
    PlusCircle,
    Edit,
    LayoutDashboard,
    ClipboardCheck,
    User
} from 'lucide-react';
import axios from 'axios';

const Navbar = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showSurveySubmenu, setShowSurveySubmenu] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const navigationLinks = {
        ADMIN: [
            { href: '/homepageadmin', label: 'Admin Dashboard', icon: LayoutDashboard },
            { href: '/user-results', label: 'Check Survey Results', icon: ClipboardCheck },
            { href: '/addindustry', label: 'Add & Edit Industry', icon: Building2 },
            { href: '/addskill', label: 'Add & Edit Skill', icon: Lightbulb },
            { href: '/addprofession', label: 'Add & Edit Profession', icon: UserCircle },
            {
                label: 'Survey Management',
                icon: ClipboardList,
                hasSubmenu: true,
                submenuItems: [
                    { href: '/addsurvey', label: 'Create a New Survey', icon: PlusCircle },
                    { href: '/surveys', label: 'Show & Edit Existing Survey', icon: Edit }
                ]
            },
            { href: '/authorization-system', label: 'Authorization System', icon: Shield }
        ],
        USER: [
            { href: '/previousresults', label: 'My Previous Results' },
            { href: '/applysurvey', label: 'View the Surveys' }
        ]
    };

    const homeLink = user?.role.name === 'ADMIN' ? '/homepageadmin' : '/homepageuser';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
                setShowSurveySubmenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-black/20 to-transparent"></div>

            <nav className="bg-gradient-to-b from-purple-800 via-purple-600 to-purple-700 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.3)] border-b border-purple-500/30 p-4 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-purple-400/5 to-purple-200/10"></div>

                <div className="flex items-center justify-between max-w-screen-xl mx-auto relative">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={homeLink}
                            className="text-xl font-bold text-white hover:text-purple-200 transition-colors duration-200 flex items-center"
                        >
                           <span className="bg-white text-purple-600 px-3 py-1 rounded-lg shadow-lg">
                               DX-HRSAM
                           </span>
                        </Link>

                        {user?.role.name === 'ADMIN' && (
                            <div className="flex items-center space-x-4">
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className={`px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-400 transition-all duration-300 shadow-md hover:shadow-lg border border-purple-400/30 flex items-center ${
                                            isDropdownOpen ? 'bg-purple-400' : ''
                                        }`}
                                    >
                                        <span className="mr-2">Admin Panel</span>
                                        <span className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                                           <ChevronDown className="w-4 h-4" />
                                       </span>
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute z-50 mt-2 w-64 rounded-lg bg-white shadow-xl border border-purple-100 animate-in slide-in-from-top-2 duration-200">
                                            {navigationLinks.ADMIN.map((link: any, index) => {
                                                const Icon = link.icon;

                                                if (link.hasSubmenu) {
                                                    return (
                                                        <div
                                                            key={link.label}
                                                            className="relative group"
                                                            onMouseEnter={() => setShowSurveySubmenu(true)}
                                                            onMouseLeave={() => setShowSurveySubmenu(false)}
                                                        >
                                                            <div className="px-4 py-3 flex items-center justify-between hover:bg-purple-50 cursor-pointer">
                                                                <div className="flex items-center space-x-3">
                                                                    <Icon className="w-5 h-5 text-purple-600" />
                                                                    <span>{link.label}</span>
                                                                </div>
                                                                <ChevronRight className="w-4 h-4 text-purple-600" />
                                                            </div>

                                                            {showSurveySubmenu && (
                                                                <div className="absolute left-[calc(100%-1px)] top-0 w-64 bg-white rounded-r-lg shadow-xl border border-purple-100 border-l-0 animate-in slide-in-from-left-2 duration-200">
                                                                    {link.submenuItems.map((subItem: any) => {
                                                                        const SubIcon = subItem.icon;
                                                                        return (
                                                                            <Link
                                                                                key={subItem.href}
                                                                                href={subItem.href}
                                                                                onClick={() => {
                                                                                    setIsDropdownOpen(false);
                                                                                    setShowSurveySubmenu(false);
                                                                                }}
                                                                            >
                                                                                <div className="px-4 py-3 flex items-center space-x-3 hover:bg-purple-50 group first:rounded-tr-lg">
                                                                                    <SubIcon className="w-5 h-5 text-purple-600" />
                                                                                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                                                                                       {subItem.label}
                                                                                   </span>
                                                                                </div>
                                                                            </Link>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <Link
                                                        key={link.href}
                                                        href={link.href}
                                                        onClick={() => setIsDropdownOpen(false)}
                                                        className={`block hover:bg-purple-50 group ${
                                                            index === 0 ? 'rounded-t-lg border-b border-purple-100' : ''
                                                        }`}
                                                    >
                                                        <div className="px-4 py-3 flex items-center space-x-3">
                                                            <Icon className="w-5 h-5 text-purple-600" />
                                                            <span className="group-hover:translate-x-1 transition-transform duration-200">
                                                               {link.label}
                                                           </span>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                <Link href="/user-results">
                                    <button className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-400 transition-all duration-300 shadow-md hover:shadow-lg border border-purple-400/30">
                                        User Results
                                    </button>
                                </Link>
                            </div>
                        )}

                        {user?.role.name === 'USER' && (
                            <div className="flex items-center space-x-4">
                                {navigationLinks.USER.map((link) => (
                                    <Link key={link.href} href={link.href}>
                                        <button className="px-4 py-2 rounded-lg bg-white text-purple-600 hover:bg-purple-50 transition-all duration-200 shadow-md hover:shadow-lg border border-purple-100">
                                            {link.label}
                                        </button>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link href="/profile">
                            <div className="w-10 h-10 rounded-full bg-white/10 border-2 border-white/70 flex items-center justify-center hover:bg-white/20 transition-colors duration-200 cursor-pointer">
                                {user?.profileImage ? (
                                    <img
                                        src={`data:image/png;base64,${user.profileImage}`}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <User className="w-6 h-6 text-white" />
                                )}
                            </div>
                        </Link>


                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-lg border-2 border-white/70 text-white hover:bg-white hover:text-purple-600 transition-all duration-200 shadow-md hover:shadow-lg backdrop-blur-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;