'use client';
import React from "react";
import AdminPanel from "@/app/components/adminpanel/AdminPanel";
import AdminGuard from "@/app/components/guards/AdminGuard";

const Home: React.FC = () => {
    return (
        <div>
            <AdminGuard>
            <AdminPanel />
        </AdminGuard>
        </div>
    );
};

export default Home;