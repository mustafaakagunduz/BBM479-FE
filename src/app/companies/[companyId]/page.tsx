'use client'
import React, { useEffect, useState } from 'react';
import CompanyDetailComponent from './CompanyDetailComponent';
import AdminGuard from '@/app/components/guards/AdminGuard';
import { use } from 'react';
import CompanySurveyChart from "@/app/companies/[companyId]/CompanySurveyChart";
import CompanyDescriptionCard from './CompanyDescriptionCard';
import axios from 'axios';
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
                const response = await axios.get(`http://localhost:8081/api/companies/${companyId}`);
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
                <div className="max-w-4xl mx-auto px-4">
                    <div className="space-y-8 py-8">
                        <Typography
                            variant="h3"
                            align="center"
                            sx={{
                                background: 'linear-gradient(to right, #9333ea, #ec4899)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 'bold',
                                mb: 4
                            }}
                        >
                            {companyName}
                        </Typography>

                        <CompanyDescriptionCard companyId={companyId} />

                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="employees" className="border rounded-lg bg-white shadow-sm">
                                <AccordionTrigger className="px-4 hover:bg-purple-50">
                                    <span className="text-lg font-semibold text-purple-600">
                                        Employee List
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <CompanyDetailComponent companyId={companyId} />
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="survey" className="border rounded-lg bg-white shadow-sm mt-4">
                                <AccordionTrigger className="px-4 hover:bg-purple-50">
                                    <span className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                                        Survey Results
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="px-4">
                                    <div className="pt-2">
                                        <CompanySurveyChart companyId={companyId} />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </div>
        </AdminGuard>
    );
};

export default CompanyDetailPage;