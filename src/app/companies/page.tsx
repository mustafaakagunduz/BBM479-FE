'use client';
import React from "react";
import AdminGuard from "@/app/components/guards/AdminGuard";
import CompanyComponent from "@/app/companies/CompanyComponent";

const CompanyPage: React.FC = () => {
    return (
        <AdminGuard>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                <CompanyComponent />
            </div>
        </AdminGuard>
    );
};

export default CompanyPage;