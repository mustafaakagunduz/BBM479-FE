'use client';
import React from "react";
import { useRouter } from "next/navigation";
import NavbarAdmin from "@/app/components/navbars/NavbarAdmin";
import AuthorizationSystem from "@/app/components/authorization-system/AuthorizationSystem";
import AdminGuard from "@/app/components/guards/AdminGuard";

const Home: React.FC = () => {


    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <div>
                <AdminGuard>
                <AuthorizationSystem></AuthorizationSystem>
            </AdminGuard>
            </div>



        </div>


    );
};

export default Home;
