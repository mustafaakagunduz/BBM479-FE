'use client'
import React, { useEffect, useState } from 'react';
import CompanyDetailComponent from './CompanyDetailComponent';
import AdminGuard from '@/app/components/guards/AdminGuard';
import { use } from 'react';
import CompanySurveyChart from "@/app/companies/[companyId]/CompanySurveyChart";
import CompanyDescriptionCard from './CompanyDescriptionCard';
import axiosInstance from "@/utils/axiosInstance";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Typography } from '@mui/material';

interface CompanyDetailPageProps {
    params: Promise<{
        companyId: string;
    }>;
}

const CompanyDetailPage: React.FC<CompanyDetailPageProps> = ({ params }) => {
    const resolvedParams = use(params);
    const companyId = resolvedParams.companyId;
    const [companyName, setCompanyName] = useState('');

    useEffect(() => {
        const fetchCompanyName = async () => {
            try {
                const response = await axiosInstance.get(`/api/companies/${companyId}`);
                setCompanyName(response.data.name);
            } catch (error) {
                console.error('Error fetching company name:', error);
            }
        };

        fetchCompanyName();
    }, [companyId]);

    return (
        <AdminGuard>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="space-y-8 py-8">
                        <Typography
                            variant="h3"
                            align="center"
                            sx={{
                                background: 'linear-gradient(to right, #9333ea, #ec4899)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 'bold',
                                mb: 4,
                                fontSize: {
                                    xs: '1.75rem',
                                    sm: '2rem',
                                    md: '2.5rem'
                                }
                            }}
                        >
                            {companyName}
                        </Typography>

                        <div className="w-full">
                            <CompanyDescriptionCard companyId={companyId} />
                        </div>

                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="employees" className="border rounded-lg bg-white shadow-sm">
                                <AccordionTrigger className="px-4 hover:bg-purple-50">
                                    <span className="text-base sm:text-lg font-semibold text-purple-600">
                                        Employee List
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="w-full">
                                    <div className="w-full">
                                        <CompanyDetailComponent companyId={companyId} />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>


                        </Accordion>
                        <CompanySurveyChart companyId={companyId} />
                    </div>
                </div>
            </div>
        </AdminGuard>
    );
};

export default CompanyDetailPage;