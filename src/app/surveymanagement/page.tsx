'use client';
import React from "react";
import { useRouter } from "next/navigation";
import NavbarAdmin from "@/app/components/navbars/NavbarAdmin";
import { Card, CardHeader, CardTitle } from '@/app/components/ui/card';
import { FilePlus, FileEdit } from 'lucide-react';
import Link from 'next/link';

const SurveyManagement = () => {
    const surveyCards = [
        {
            title: "Create a New Survey",
            icon: <FilePlus className="w-12 h-12 mb-4 text-purple-600" />,
            href: "/addsurvey",
            description: "Design and create new surveys from scratch"
        },
        {
            title: "Show/Edit Existing Survey",
            icon: <FileEdit className="w-12 h-12 mb-4 text-purple-600" />,
            href: "/surveys",
            description: "View and modify your existing surveys"
        }
    ];

    return (
        <div>
            <NavbarAdmin />
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Survey Management
                        </h1>
                        <p className="mt-4 text-gray-600">
                            Create new surveys or manage existing ones
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {surveyCards.map((card, index) => (
                            <Link href={card.href} key={index}>
                                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer bg-white/90 backdrop-blur-sm border-purple-100">
                                    <div className="p-6 flex flex-col items-center text-center">
                                        {card.icon}
                                        <CardHeader className="p-0">
                                            <CardTitle className="text-xl font-semibold text-gray-800">
                                                {card.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <p className="mt-4 text-gray-600 text-sm">
                                            {card.description}
                                        </p>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SurveyManagement;