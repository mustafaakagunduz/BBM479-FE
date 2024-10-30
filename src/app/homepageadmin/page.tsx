'use client';
import React from "react";
import { useRouter } from "next/navigation";
import NavbarAdmin from "@/app/components/navbars/NavbarAdmin";
import AdminPanel from "@/app/components/adminpanel/AdminPanel";

const Home: React.FC = () => {


    return (
        <div>
            <NavbarAdmin></NavbarAdmin>
            <AdminPanel></AdminPanel>
        </div>
    );
};

export default Home;
