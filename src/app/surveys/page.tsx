"use client"

import SurveyList from "./components/SurveyList";
import AdminGuard from "@/app/components/guards/AdminGuard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

function SurveyPage() {
    return (
        <>
            <AdminGuard>
                <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                    <div className="container mx-auto px-4 py-8">
                        <Link
                            href="/surveymanagement"
                            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 group transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            <span>Back to Survey Management</span>
                        </Link>

                        <h1 className="text-3xl font-bold text-gray-800 mb-8">
                            Available Surveys
                        </h1>

                        <SurveyList />
                    </div>
                </div>
            </AdminGuard>
        </>
    );
}

export default SurveyPage;