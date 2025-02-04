"use client"

import {Card, CardContent, CardHeader, CardTitle} from '../ui/card';
import { FileSpreadsheet, Building } from 'lucide-react';
import Link from 'next/link';

function AdminPanel() {
    const adminCards = [
        {
            title: "Survey Management System",
            icon: <FileSpreadsheet className="w-12 h-12 mb-4 text-purple-600" />,
            href: "/surveymanagement",
            description: "Create/Edit surveys"
        },
        {
            title: "Company Management System",
            icon: <Building className="w-12 h-12 mb-4 text-purple-600" />,
            href: "/companies",
            description: "Manage and monitor company profiles"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Admin Control Panel
                    </h1>
                </div>

                <Card className="mb-8 w-full">
                    <CardContent className="space-y-4 text-center">
                        <p className="text-lg text-purple-600 font-bold">Welcome to Admin Control Panel</p>
                        <ul className="space-y-4 list-none p-0">
                            <li>
                                <Link
                                    href="/surveymanagement"
                                    className="text-purple-600 hover:text-purple-800 transition-colors underline decoration-purple-300 hover:decoration-purple-800"
                                >
                                    <span className="font-medium cursor-pointer">Create and manage surveys for your organization</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/companies"
                                    className="text-purple-600 hover:text-purple-800 transition-colors underline decoration-purple-300 hover:decoration-purple-800"
                                >
                                    <span className="font-medium cursor-pointer">Monitor and manage company profiles, employees and their data</span>
                                </Link>
                            </li>
                        </ul>
                        <p className="mt-4 text-purple-600 font-bold">Click on a card below to access the related management system.</p>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {adminCards.map((card, index) => (
                        <Link href={card.href} key={index}
                              className="relative group hover:z-10 transition-all duration-300 w-full">
                            <Card
                                className="h-72 w-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer bg-white/90 backdrop-blur-sm border-purple-100">
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
    );
}

export default AdminPanel;