'use client';
import React from "react";
import NavbarUser from "@/app/components/navbars/NavbarUser";
import WelcomeCard from "@/app/homepageuser/WelcomeCard";

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <NavbarUser></NavbarUser>
            <WelcomeCard></WelcomeCard>
        </div>
    );
};

export default Home;