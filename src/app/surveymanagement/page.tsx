'use client';
import React from "react";
import { Card, CardHeader, CardTitle } from '@/app/components/ui/card';
import { FilePlus, FileEdit, PenTool, Briefcase, Building2 } from 'lucide-react';
import Link from 'next/link';
import AdminGuard from "@/app/components/guards/AdminGuard";

const SurveyManagement = () => {
    const surveyCards = [
        {
            title: "Add & Edit Industry to the System",
            icon: <Building2 className="w-12 h-12 mb-4 text-purple-600" />,
            href: "/addindustry",
            description: "Define new industry sectors"
        },
        {
            title: "Add & Edit Skill to the System",
            icon: <PenTool className="w-12 h-12 mb-4 text-purple-600" />,
            href: "/addskill",
            description: "Add and manage skills in various industries"
        },
        {
            title: "Add & Edit Profession to the System",
            icon: <Briefcase className="w-12 h-12 mb-4 text-purple-600" />,
            href: "/addprofession",
            description: "Create and update professional roles"
        },

        {
            title: "Create/Edit/Delete Surveys",
            icon: <FileEdit className="w-12 h-12 mb-4 text-purple-600" />,
            href: "/surveys",
            description: "View and modify your existing surveys"
        }
    ];

    return (
        <div>
            <AdminGuard>
                <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-full mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Survey Management
                            </h1>
                            <p className="mt-4 text-gray-600">
                                Create new surveys or manage existing ones
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <div className="inline-flex overflow-x-auto gap-6 pb-6 px-4">
                                {surveyCards.map((card, index) => (
                                    <Link href={card.href} key={index}
                                          className="flex-none">
                                        <Card
                                            className="h-72 w-64 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer bg-white/90 backdrop-blur-sm border-purple-100">
                                            <div className="p-6 flex flex-col items-center text-center h-full">
                                                <div className="w-12 h-12 mb-4">
                                                    {card.icon}
                                                </div>
                                                <CardHeader className="p-0">
                                                    <CardTitle className="text-xl font-semibold text-purple-700">
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
            </AdminGuard>
        </div>
    );
};

export default SurveyManagement;