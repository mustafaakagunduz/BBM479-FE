import Link from 'next/link';
import React from 'react';

const NavbarUser: React.FC = () => {
    return (
        <nav className="bg-purple-600 shadow-md p-4 w-full">
            <div className="flex items-center justify-between max-w-screen-xl mx-auto">
                {/* Sol Üstteki Logo */}
                <Link href="/homepageuser" className="text-xl font-bold text-white hover:text-purple-200">
                    DX-HRSAM
                </Link>

                {/* Ortada My Previous Results Butonu */}
                <div className="flex-grow text-center space-x-4">
                    <Link href="/previousresult">
                        <button className="px-4 py-2 rounded-lg bg-white text-purple-600 hover:bg-purple-100 transition">
                            My Previous Results
                        </button>
                    </Link>
                    <Link href="/applysurvey">
                        <button className="px-4 py-2 rounded-lg bg-white text-purple-600 hover:bg-purple-100 transition">
                            Apply the Survey
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

export default NavbarUser;
