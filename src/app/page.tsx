'use client';
import React from "react";
import { useRouter } from "next/navigation";

const Home: React.FC = () => {
    const router = useRouter();

    const handleNavigation = () => {
        router.push('/login');
    };

    return (
        <div>
            <p>burası anasayfa, <span onClick={handleNavigation} style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>login ekranına gitmek için tıklatın</span></p>
        </div>
    );
};

export default Home;
