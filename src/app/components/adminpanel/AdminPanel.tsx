"use client"

import { Card, CardHeader, CardTitle } from '../ui/card';
import { PenTool, Briefcase, Building2, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';

function AdminPanel() {
    const adminCards = [
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
            title: "Survey Management System",
            icon: <FileSpreadsheet className="w-12 h-12 mb-4 text-purple-600" />,
            href: "/surveymanagement",
            description: "Create/Edit surveys"
        },
        {
            title: "Authorization System",
            icon: <FileSpreadsheet className="w-12 h-12 mb-4 text-purple-600" />,
            href: "/authorization-system",
            description: "Manage user permissions"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Admin Control Panel
                    </h1>
                    <p className="mt-4 text-gray-600">
                        Manage your system components and configurations
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-24 p-6">
                    {adminCards.map((card, index) => (
                        <Link href={card.href} key={index}
                              className="relative z-0 hover:z-10 transition-all duration-500"> {/* transition süresini artırdık */}
                            <Card
                                className="h-72 w-72 transform transition-all duration-500 ease-in-out hover:shadow-xl hover:scale-105 cursor-pointer bg-white/90 backdrop-blur-sm border-purple-100">
                                {/* transform ve ease-in-out ekledik, duration artırıldı */}
                                <div className="p-6 flex flex-col items-center text-center h-full">
                                    <div className="w-12 h-12 mb-4">
                                        {card.icon}
                                    </div>
                                    <CardHeader className="p-0">
                                        <CardTitle className="text-xl font-semibold text-gray-800 text-purple-700">
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
    );
}

export default AdminPanel;