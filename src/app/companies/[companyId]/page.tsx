'use client';
import React from 'react';
import CompanyDetailComponent from './CompanyDetailComponent';
import AdminGuard from '@/app/components/guards/AdminGuard';
import { use } from 'react';
import CompanySurveyChart from "@/app/companies/[companyId]/CompanySurveyChart";

interface CompanyDetailPageProps {
    params: Promise<{
        companyId: string;
    }>;
}

const CompanyDetailPage: React.FC<CompanyDetailPageProps> = ({ params }) => {
    const resolvedParams = use(params);
    const companyId = resolvedParams.companyId;

    return (
        <AdminGuard>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="space-y-8 py-8">
                        <CompanyDetailComponent companyId={companyId} />
                        <CompanySurveyChart companyId={companyId} />
                    </div>
                </div>
            </div>
        </AdminGuard>
    );
};

export default CompanyDetailPage;