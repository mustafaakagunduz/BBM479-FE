'use client';
import React from "react";
import { useRouter } from "next/navigation";
import NavbarAdmin from "@/app/components/navbars/NavbarAdmin";
import AdminPanel from "@/app/components/adminpanel/AdminPanel";
import AdminPanelDeneme from "@/app/components/adminpanel/AdminPanelDeneme";

const Home: React.FC = () => {


    return (
        <div>
            <NavbarAdmin></NavbarAdmin>
            <AdminPanelDeneme></AdminPanelDeneme>
        </div>
    );
};

export default Home;
