'use client';
import React from "react";
import AdminGuard from "@/app/components/guards/AdminGuard";
import CompanyComponent from "@/app/companies/CompanyComponent";
import CompanyAdder from "@/app/companies/CompanyAdder";

const CompanyPage: React.FC = () => {
    return (
        <AdminGuard>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">

                    <div className="py-8">
                        <CompanyAdder />
                        <div className="h-8"></div>
                        <CompanyComponent />
                        <div className="h-8"></div>
                    </div>
                </div>

        </AdminGuard>
    );
};

export default CompanyPage;