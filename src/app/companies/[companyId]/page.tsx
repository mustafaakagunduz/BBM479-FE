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
                <CompanyDetailComponent companyId={companyId} />
                <CompanySurveyChart companyId={companyId} />
            </div>
        </AdminGuard>
    );
};

export default CompanyDetailPage;