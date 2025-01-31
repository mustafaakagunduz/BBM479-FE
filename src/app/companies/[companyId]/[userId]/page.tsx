'use client';
import React from 'react';
import { use } from 'react';
import UserResultComponent from './UserResultComponent';
import AdminGuard from '@/app/components/guards/AdminGuard';

interface PageProps {
    params: Promise<{
        companyId: string;
        userId: string;
    }>;
}

const UserResultsPage = ({ params }: PageProps) => {
    const resolvedParams = use(params);

    return (
        <AdminGuard>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                <UserResultComponent
                    companyId={resolvedParams.companyId}
                    userId={resolvedParams.userId}
                />
            </div>
        </AdminGuard>
    );
};

export default UserResultsPage;