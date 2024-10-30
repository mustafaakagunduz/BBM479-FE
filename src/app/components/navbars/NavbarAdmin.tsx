import Link from 'next/link';
import React from 'react';

const NavbarAdmin: React.FC = () => {
    return (
        <nav className="bg-purple-600 shadow-md p-4 w-full">
            <div className="flex items-center justify-between max-w-screen-xl mx-auto">
                {/* Sol Üstteki Logo */}
                <Link href="/homepageadmin" className="text-xl font-bold text-white hover:text-purple-200">
                    DX-HRSAM
                </Link>

                {/* Ortada Admin Panel Butonu */}
                <div className="flex-grow text-center">
                    <Link href="/homepageadmin">
                        <button className="px-4 py-2 rounded-lg bg-white text-purple-600 hover:bg-purple-100 transition">
                            Admin Panel
                        </button>
                    </Link>
                </div>

                {/* Sağ Üstteki Logout Butonu */}
                <Link href="/login">
                    <button className="px-4 py-2 rounded-lg border border-white text-white hover:bg-purple-700 hover:text-white transition">
                        Logout
                    </button>
                </Link>
            </div>
        </nav>
    );
};

export default NavbarAdmin;
